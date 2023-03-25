const jwt=require("jsonwebtoken");
const adminModel = require("../models/adminModel");


module.exports = async (req, res, next) => {
    try {
        // checking for authToken in headers
        const authHeader=req.headers["authorization"];
        const authToken =authHeader && authHeader.split(" ")[1];
        if (!authToken)  return res.status(401).json({ message: "no auth token" });
        const decoded = jwt.verify(authToken, process.env.JWT_KEY);
        const admin = await adminModel.findOne({ _id: decoded.id });
        if (!admin)     return res.status(403).json({ message: "Unauthorized middle" });
        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({status:false, message: "Unauthorized" });
    }
};
