const jwt=require("jsonwebtoken");
const userModel=require("../models/userModel");
module.exports = async (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(" ")[1];
        const {token}=req.body;
        if (!token)     return res.status(401).json({ message: "no auth token" });
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findOne({ _id: decoded._id });
        if (!user)     return res.status(401).json({ message: "Unauthorized middle" });
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorizeddddddddddddd" });
    }
};