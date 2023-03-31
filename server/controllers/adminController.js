const adminModel = require("../models/adminModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const hrModel = require("../models/hrModel");
const sendEmail = require("../config/mailer");


// creating jwt token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
};
// generating Password
function generatePassword() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$&";
    let password = "";
    for (let i = 0; i < 6; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}


// handling errors      
const handleErrors = (error, req, res) => {
    const statusCode = error.status || 500;
    let message = error.message || "Something went Wrong";
    res.status(statusCode).json({ status: false, message: message });
};

//  Admin login
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // checking if the values are null
        if (!email || !password) throw Error("All Fields required");
        // matching the account with email  
        const admin = await adminModel.findOne({ email: email });
        // checking if the account  exists
        if (!admin) throw Error("incorrect email or password");
        const auth = await bcrypt.compare(password, admin.password);
        if (!auth) throw Error("incorrect email or password");
        // creating the jwt token 
        const token = createToken(admin._id);
        res.status(200).json({ status: true, message: "Login Success", token: token });
    } catch (error) {
        handleErrors(error, req, res);
    }
};

// admin adding users
module.exports.addStudents = async (req, res) => {
    try {
        const { username, studentID, email } = req.body;
        // checking if the values are null
        if (!username || !studentID || !email) throw Error("All fields required");
        // checking if the student  already has account
        const alreadyExist = await userModel.findOne({
            $or: [{ studentID }, { email }]
        });
        if (alreadyExist?.studentID === studentID) {
            throw new Error("Student ID already exists");
        } else if (alreadyExist?.email === email) {
            throw new Error("Email ID already exists");
        }
        // generating Password
        const password = generatePassword();
        // sending temporary password via email  
        const Subject = "Your temporary password for Future Flow Student Placement website";
        const mailOptions = `<p>Dear ${username},</p><br/>
        <p>Welcome to the Student Placement Cell website! You have been successfully registered as a student.</p><br/>
        <p>Your temporary password is: ${password}</p><br/>
        <p>Please use this password to log in to the website. You will be prompted to change your password after logging in for the first time.</p><br/>
        <p>Best regards,</p><br/>
        <p>Future Flow Student Placement team</p><br/>`;

        const MailSend = await sendEmail(email, Subject, mailOptions);
        if (!MailSend.status) throw new Error("server error");
        const newStudent = new userModel({
            name: username,
            studentID: studentID,
            email: email,
            password: password
        });
        await newStudent.save();
        res.status(200).json({ status: true, message: "successfully added user" });
    } catch (error) {
        console.error(error);
        handleErrors(error, req, res);
    }


};

// Admin adding hr managers
module.exports.addHrManager = async (req, res) => {
    try {
        const { username, email,company } = req.body;
        if (!username || !email || !company) throw new Error("All fields required");
        const alreadyExist = await hrModel.findOne({ email: email });
        if (alreadyExist !== null) throw new Error("already exists");
        // generating Password
        const password = generatePassword();
        // sending temporary password via email  
        const subject = "Your temporary password for Future Flow Student Placement website";
        const mailOptions = `<p>Dear ${username},</p><br/>
        <p>Welcome to the Student Placement Cell website! You have been successfully registered as a HR manager.</p><br/>
        <p>Your temporary password is: ${password}</p>
        <p>Please use this password to log in to the website. You will be prompted to change your password after logging in for the first time.</p>
        <p>Best regards,</p>
        <p>Future Flow Student Placement team</p><br/>`;
        const MailSend = await sendEmail(email, subject, mailOptions);
        if (!MailSend.status) throw new Error("server error");
        const newHr = new hrModel({
            name: username,
            email: email,
            company:company,
            password: password
        });
        await newHr.save();
        res.status(200).json({ status: true, message: "successfully added user" });
    } catch (error) {
        console.error(error);
        handleErrors(error, req, res);
    }
};

module.exports.getAllStudents = async (req, res) => {
    try {
        const students = await userModel.find({}, { password: 0 }).lean();
        res.status(200).json({ status: true, result: students });
    } catch (error) {
        console.error(error);
        handleErrors(error, req, res);
    }

};
module.exports.getHRManagers = async (req, res) => {
    try {
        const hrManagers = await hrModel.find({}, { password: 0 }).lean();
        res.status(200).json({ status: true, result: hrManagers });
    } catch (error) {
        console.error(error);
        handleErrors(error, req, res);
    }

};
module.exports.changeUserStatus = async (req, res) => {
    try {
        const { status, id } = req.body;
        const result = await userModel.findByIdAndUpdate({ _id: id }, { $set: { blocked: status } }).exec();
        if (result == null) throw new Error("Can't Find a matching Entry" );
        res.status(200).json({ status: true, message: "Successfully updated" });
    } catch (error) {
        console.error(error);
        handleErrors(error, req, res);
    }

};
module.exports.changeHRStatus = async (req, res) => {
    try {
        const { status, id } = req.body;
        const result = await hrModel.findByIdAndUpdate({ _id: id }, { $set: { blocked: status } }).exec();
        if (result == null) throw new Error("Can't Find a matching Entry" );
        res.status(200).json({ status: true, message: "Successfully updated" });
    } catch (error) {
        console.error(error);
        handleErrors(error, req, res);
    }
};