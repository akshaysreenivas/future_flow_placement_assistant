const jwt=require("jsonwebtoken");
const userModel=require("../models/userModel");
module.exports = async (req, res, next) => {
    try {
        const authHeader=req.headers["authorization"];
        const authToken =authHeader && authHeader.split(" ")[1];
        if (!authToken)     return res.status(401).json({status:false, message: "no auth token" });
        const decoded = jwt.verify(authToken, process.env.JWT_KEY);
        const user = await userModel.findOne({ _id: decoded.id });
        if (!user)     return res.status(403).json({status:false, message: "Unauthorized" });
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({status:false, message: "Unauthorized" });
    }
};