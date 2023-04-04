const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



// creating jwt token
const maxAge = 3 * 24 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
};


module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // throwing error if values are not provided
        if (!email || !password) throw Error("All Fields required");
        // finding the user 
        const user = await userModel.findOne({ email: email });
        if (!user) return res.status(401).json({ status: false, message: "incorrect email or password" });
        // comparing password 
        const auth = await bcrypt.compare(password, user.password);
        // sending false response if the password doesn't match
        if (!auth) return res.status(401).json({ status: false, message: "incorrect email or password" });
        // checking whether the user is bolcked or not 
        if (user.blocked) return res.status(200).json({ status: false, message: "Your Account is Temporarly Suspended" });
        // if login success and the if the user is inactive  changing the status to active 
        if (user.status === "Inactive") {
            await userModel.updateOne({ email: email }, { status: "Active" });
        }
        // calling function to create jwt token 
        const token = createToken(user._id);

        res
            .status(200)
            .json({ status: true, message: "Login Success", token: token });
    } catch (error) {
        next(error);
    }
};

