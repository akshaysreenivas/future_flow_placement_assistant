const jwt=require("jsonwebtoken");
const hrModel=require("../models/hrModel");

module.exports = async (req, res, next) => {
    try {
        const authHeader=req.headers["authorization"];
        const authToken =authHeader && authHeader.split(" ")[1];
        if (!authToken)     return res.status(401).json({ message: "no auth token" });
        const decoded = jwt.verify(authToken, process.env.JWT_KEY);
        const hr = await hrModel.findOne({ _id: decoded.id });
        if (!hr)     return res.status(403).json({ message: "Unauthorized" });
        req.user = hr;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};