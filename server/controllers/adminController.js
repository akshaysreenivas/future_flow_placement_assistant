const adminModel = require("../models/adminModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const hrModel = require("../models/hrModel");

const maxAge = 3 * 24 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
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
        err.message = "Incorrect email or password";
        return err;
    } else if (errors.message.includes("already exists")) {
        err.message = "Already Exists";
        return err;
    } else {
        errors.message = "server error";
        return err;
    }
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
        res
            .status(200)
            .json({ status: true, message: "Login Success", token: token });
    } catch (error) {
        const errors = handleErrors(error);
        res.json(errors);
    }
};

// admin adding users
module.exports.addUsers = async (req, res) => {
    try {
        const { username, studentID } = req.body;
        // checking if the values are null
        if (!username || !studentID) throw Error("all fields required");
        // checking if the student  already has account
        const alreadyExist = await userModel.findOne({ studentID });
        if (alreadyExist !== null) throw new Error("already exists");
        const newStudent = new userModel({
            name: username,
            studentID: studentID,
        });
        await newStudent.save();
        res.status(200).json({ status: true, message: "successfully added user" });
    } catch (error) {
        const errors = handleErrors(error);
        res.json(errors);
    }
};

// Admin adding hr managers
module.exports.addHrManager = async (req, res) => {
    try {
        const { username, email } = req.body;
        if (!username || !email) throw Error("all fields required");
        const alreadyExist = await hrModel.findOne({ email: email });
        console.log("hiii", alreadyExist);
        if (alreadyExist !== null) throw new Error("already exists");
        const newHr = new hrModel({
            name: username,
            email: email,
        });
        await newHr.save();
        res.status(200).json({ status: true, message: "successfully added user" });
    } catch (error) {
        console.error(error);
        const errors = handleErrors(error);
        res.json(errors);
    }
};