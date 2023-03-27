const userModel = require("../models/userModel");
const sendEmail = require("../config/mailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// creating jwt token
const maxAge = 3 * 24 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
};


// Generating otp 
const createOTP = () => {
    let otp = Math.floor(1000 + Math.random() * 8999);
    return otp.toString().padStart(4, "0");
};

// handling errors 
const handleErrors = (errors) => {
    let err = { status: false };
    if (errors.code === 11000) {
        err.message = "already registered";
        return err;
    } else if (errors.message.includes("All Fields required")) {
        err.message = "All Fields required";
        return err;
    } else if (errors.message.includes("incorrect email or password")) {
        err.message = "incorrect email or password";
        return err;
    } else if (errors.message.includes("Student ID does not exist")) {
        err.message = "Please enter a valid StudentId";
        return err;
    } else if (errors.message.includes("otp missmatch")) {
        err.message = "Invalid otp";
        return err;
    } else if (errors.message.includes("email and password required")) {
        err.message = "email and password required";
        return err;
    } else if (err) {
        errors.message = "server error";
        return err;
    }
};


module.exports.signup = async (req, res) => {
    try {
        const { studentID, email } = req.body;
        // checking if the fields are nulll     
        if (!studentID || !email) throw new Error("All fields required");

        // checking if it is a valid student id
        const student = await userModel.findOne({ studentID }, { _id: 0, __v: 0 });
        if (!student) throw new Error("Student ID does not exist");

        // checking if already an account is registered with the student id
        if (student.active) {
            return res.json({ status: false, message: "Student ID already registered" });
        }

        // checking if email already exists
        const emailExists = await userModel.exists({ email });
        if (emailExists) {
            return res.json({ status: false, message: "Email already exists" });
        }
        // creating otp  
        const OTP = createOTP();
        // sending otp via email   
        const mailOptions = `Hello,  <b>${OTP}</b>  is your future flow verification code`;
        const otpSend = await sendEmail(email, "Otp", mailOptions);
        if (!otpSend.status) throw new Error("server error");
        req.session.otp = OTP;
        req.session.email = email;
        req.session.studentID = studentID;
        res.status(200).json({ status: true, message: "Student ID verified" });
    } catch (error) {
        console.log(error);
        const errors = handleErrors(error);
        res.json(errors);

    }
};


module.exports.otpVerification = async (req, res) => {
    try {
        const { otp } = req.body;
        const originalotp = parseInt(req.session.otp);
        const enteredotp = parseInt(otp);
        if (originalotp !== enteredotp) throw new Error("otp missmatch");
        res.status(200).json({ status: true, message: "otp true" });
    } catch (error) {
        const errors = handleErrors(error);
        res.json(errors);
    }
};


module.exports.createAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const email = req.session.email;
        console.log(email);
        // req.session.destroy();
        const studentID = req.session.studentID;
        console.log(studentID);
        if (!email || !password || !studentID) throw new Error("email and password required");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await userModel.findOneAndUpdate({ studentID: studentID }, { $set: { password: hash, email: email, active: true } }, { new: true });
        req.session.destroy();
        res.status(200).json({ status: true, message: "Account Created Successfully" });
    } catch (error) {
        console.error(error);
        const errors = handleErrors(error);
        res.json(errors);
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw Error("All Fields required");
        const user = await userModel.findOne({ email: email });
        if (!user) throw Error("incorrect email or password");
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) throw Error("incorrect email or password");
        const token = createToken(user._id);
        res
            .status(200)
            .json({ status: true, message: "Login Success", token: token });
    } catch (error) {
        console.log(error);
        const errors = handleErrors(error);
        res.json(errors);
    }
};