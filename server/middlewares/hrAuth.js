const jwt = require("jsonwebtoken");
const hrModel = require("../models/hrModel");

module.exports = async (req, res, next) => {
    try {
        // Checking for token in the header 
        const authHeader = req.headers["authorization"];
        const authToken = authHeader && authHeader.split(" ")[1];
        // if not sending error
        if (!authToken) return res.status(401).json({login:false, message: "no auth token" });
        // verifying the token
        const decoded = jwt.verify(authToken, process.env.JWT_KEY);
        // checking for if the user exist with the decoded id 
        const hr = await hrModel.findOne({ _id: decoded.id });
        // if not sending error
        if (!hr) return res.status(403).json({login:false, message: "Unauthorized" });
        // checking whether the user is blocked 

        if (hr.blocked) return res.status(200).json({login:false, status: false, message: "Your Account is Temporarly Suspended" });
        req.user = hr;
        next();
    } catch (error) {
        res.status(401).json({login:false, message: "Unauthorized" });
    }
};