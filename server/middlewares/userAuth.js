const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
module.exports = async (req, res, next) => {
    try {
        // Checking for token in the header 
        const authHeader = req.headers["authorization"];
        const authToken = authHeader && authHeader.split(" ")[1];
        // if not sending error
        if (!authToken) return res.json({ loginfail: true, status: false, message: "no auth token" });
        // decoding the token 
        const decoded = jwt.verify(authToken, process.env.JWT_KEY);
        // checking for if the user exist with the decoded id 
        const user = await userModel.findOne({ _id: decoded.id });
        if (!user) return res.json({ loginfail: true, status: false, message: "Unauthorized" });
        // checking whether the user is blocked 
        if (user.blocked) return res.status(403).json({ status: false, message: "Your Account is Temporarly Suspended" });
        req.user = user;
        next();
    } catch (error) {
        res.json({ loginfail: true, status: false, message: "Unauthorized" });
    }
};