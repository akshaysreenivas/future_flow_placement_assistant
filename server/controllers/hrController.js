const hrModel = require("../models/hrModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// creating jwt token
const maxAge = 3 * 24 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
};


// handling errors 
const handleErrors = (error, req, res) => {
    const statusCode = error.status || 500;
    let message = error.message || "Something went Wrong";
    res.status(statusCode).json({ status: false, message: message });
};




module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new Error("All Fields required");
        const user = await hrModel.findOne({ email: email });
        if (!user) throw new Error("incorrect email or password");
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) throw new Error("incorrect email or password");
        const token = createToken(user._id);
        res
            .status(200)
            .json({ status: true, message: "Login Success", token: token });
    } catch (error) {
        console.log(error);
        handleErrors(error, req, res);

    }
};