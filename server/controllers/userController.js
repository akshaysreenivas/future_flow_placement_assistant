const userModel = require("../models/userModel");
const sendEmail = require("../config/mailer");

const createOTP = () => {
    let otp = Math.floor(1000 + Math.random() * 8999);
    return otp.toString().padStart(4, "0");
};


const handleErrors = (errors) => {
    let err = { status: false };
    if (errors.code === 11000) {
        err.message = "already registered";
        return err;
    } else if (errors.message.includes("All Fields required")) {
        err.message = "All Fields required";
        return err;
    } else if (errors.message.includes("incorrect username or password")) {
        err.message = "Incorrect username or password";
        return err;
    } else if (errors.message.includes("not Exist")) {
        err.message = "Please enter a valid StudentId";
        return err;
    } else if (errors.message.includes("otp missmatch")) {
        err.message = "Invalid otp";
        return err;
    } else if (err) {
        errors.message = "server error";
        return err;
    }
};


module.exports.signup = async (req, res) => {
    try {
        const { studentID, email } = req.body;
        if (!studentID || !email) throw Error("All Fields required");
        const student = await userModel.findOne({ studentID: studentID });
        if (!student) throw new Error("not Exist");
        const OTP = createOTP();
        const mailOptions = `Hello,  <b>${OTP}</b>  is your future flow verification code`;
        const otpSend = await sendEmail(email, "Otp", mailOptions);
        if (!otpSend.status) throw new Error("server error");
        req.session.otp = OTP;
        res.status(200).json({ status: true, message: "Student ID verified" });
    } catch (error) {
        const errors = handleErrors(error);
        res.json(errors);

    }
};

module.exports.otpVerification = async (req, res) => {
    try {
        const {otp} = req.body;
        const originalotp = parseInt(req.session.otp);
        const enteredotp = parseInt(otp);
        if (originalotp !== enteredotp) throw new Error("otp missmatch");
        res.status(200).json({ status: true, message: "otp true" });

    } catch (error) {
        const errors = handleErrors(error);
        res.json(errors);
    }
};