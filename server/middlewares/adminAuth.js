const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");


module.exports = async (req, res, next) => {
    try {
        // checking for authToken in headers
        const authHeader = req.headers["authorization"];
        const authToken = authHeader && authHeader.split(" ")[1];
        // if not sending error
        if (!authToken) return res.status(401).json({ message: "no auth token" });
        // verifying the token 
        const decoded = jwt.verify(authToken, process.env.JWT_KEY);
        // checking for if the user exist with the decoded id 
        const admin = await adminModel.findOne({ _id: decoded.id });
        // if not sending error
        if (!admin) return res.status(403).json({ message: "Unauthorized" });
        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ status: false, message: "Unauthorized" });
    }
};
