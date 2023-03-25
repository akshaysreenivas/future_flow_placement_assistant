const jwt=require("jsonwebtoken");
const hrModel=require("../models/hrModel");

module.exports = async (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(" ")[1];
        const {token}=req.body;
        if (!token)     return res.status(401).json({ message: "no auth token" });
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const hr = await hrModel.findOne({ _id: decoded._id });
        if (!hr)     return res.status(401).json({ message: "Unauthorized middle" });
        req.hr = hr;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorizeddddddddddddd" });
    }
};