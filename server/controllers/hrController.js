// importing modules 
const hrModel = require("../models/hrModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jobModel = require("../models/jobModel");


// creating jwt token
const maxAge = 3 * 24 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
};


// login 
module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // throwing error if values are not provided
        if (!email || !password) throw new Error("All Fields required");
        // finding the user 
        const user = await hrModel.findOne({ email: email });
        if (!user) return res.status(401).json({ status: false, message: "incorrect email or password" });
        // comparing password 
        const auth = await bcrypt.compare(password, user.password);
        // sending false response if the password doesn't match
        if (!auth) return res.status(401).json({ status: false, message: "incorrect email or password" });
        // checking whether the user is bolcked or not 
        if (user.blocked) return res.status(200).json({ status: false, message: "Your Account is Temporarly Suspended" });
        // calling function to create jwt token 
        const token = createToken(user._id);
        res
            .status(200)
            .json({ status: true, message: "Login Success", token: token });
    } catch (error) {
        next(error);

    }
};


// adding jobs
module.exports.addjob = async (req, res, next) => {
    try {
        const hrID = req.user.id;
        let { department, job_type, location, skills, experience, min_salary, max_salary, description } = req.body;
        // checking if the values are null
        if (!experience) {
            experience = "No Prior Experience Needed";
        }

        if (!department || !job_type || !location || !experience || !min_salary || !max_salary || !description) throw Error("All fields required");
        const newJob = new jobModel({
            department: department,
            job_type: job_type,
            location: location,
            skills: skills,
            experience: experience,
            min_salary: min_salary,
            max_salary: max_salary,
            description: description,
            hrID: hrID

        });

        await newJob.save();
        res.status(200).json({ status: true, message: "Successfully Added Job" });
    } catch (error) {
        next(error);
    }
};

module.exports.getAllJobPosts = async (req, res, next) => {
    try {
        const hrID = req.user.id;

        const jobs = await jobModel.find({ hrID: hrID });
        res.status(200).json({ status: true, result: jobs });
    } catch (error) {
        next(error);
    }

};
module.exports.changeJobStatus = async (req, res, next) => {
    try {
        const { status, id } = req.body;
        const result = await jobModel.findByIdAndUpdate({ _id: id }, { $set: { active: status } }).exec();
        if (result == null) throw new Error("Can't Find a matching Entry");
        res.status(200).json({ status: true, message: "Successfully updated Job Status" });
    } catch (error) {
        next(error);
    }

};