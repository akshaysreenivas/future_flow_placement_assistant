const adminModel = require("../models/adminModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    } else if (errors.message.includes("incorrect username or password")) {
        err.message = "Incorrect username or password";
        return err;
    } else if (errors.message.includes("already exists")) {
        err.message = "Student Already Exists";
        return err;
    } else if (err) {
        errors.message = "server error";
        return err;
    }
};

//  Admin login
module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) throw Error("All Fields required");
        const admin = await adminModel.findOne({ username: username });
        if (!admin) throw Error("incorrect username or password");
        const auth = await bcrypt.compare(password, admin.password);
        if (!auth) throw Error("incorrect username or password");
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
        if (!username || !studentID) throw Error("all fields required");
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
