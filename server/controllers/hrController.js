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


// handling errors 
const handleErrors = (error, req, res) => {
    const statusCode = error.status || 500;
    let message = error.message || "Something went Wrong";
    res.status(statusCode).json({ status: false, message: message });
};


// login 

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new Error("All Fields required");
        const user = await hrModel.findOne({ email: email });
        if (!user)  return res.status(401).json({ status: false, message: "incorrect email or password" });
        const auth = await bcrypt.compare(password, user.password);
        if (!auth)  return res.status(401).json({ status: false, message: "incorrect email or password" });
        if (user.status === "Blocked") return res.status(200).json({ status: false, message: "You have been blocked by the Admin" });

        const token = createToken(user._id);
        res
            .status(200)
            .json({ status: true, message: "Login Success", token: token });
    } catch (error) {
        console.log(error);
        handleErrors(error, req, res);

    }
};


// adding jobs
module.exports.addjob = async (req, res) => {
    try {
        const hrID =req.user.id;
        let { department, job_type, location, skills, experience, min_salary, max_salary, description } = req.body;
        console.log(req.body);
        // checking if the values are null
        if(!experience){
            experience="No Prior Experience Needed";
        }
        
        if (!department || !job_type || !location  || !experience || !min_salary || !max_salary || !description) throw Error("All fields required");
        const newJob = new jobModel({
            department: department,
            job_type: job_type,
            location: location,
            skills: skills,
            experience: experience,
            min_salary: min_salary,
            max_salary: max_salary,
            description: description,
            hrID:hrID

        });

        await newJob.save();
        res.status(200).json({ status: true, message: "Successfully Added Job" });
    } catch (error) {
        console.log("hiiiiii");
        console.error(error);
        handleErrors(error, req, res);
    }
};

module.exports.getAllJobPosts= async (req, res) => {
    try {
        const hrID =req.user.id;

        const jobs = await jobModel.find({hrID:hrID});
        res.status(200).json({ status: true, result: jobs });
    } catch (error) {
        console.error(error);
        handleErrors(error, req, res);
    }

};
module.exports.changeJobStatus= async (req, res) => {
    try {
        const { status, id } = req.body;
        const result = await jobModel.findByIdAndUpdate({ _id: id }, { $set: { active: status } }).exec();
        if (result == null) throw new Error("Can't Find a matching Entry" );
        res.status(200).json({ status: true, message: "Successfully updated Job Status" });
    } catch (error) {
        console.error(error);
        handleErrors(error, req, res);
    }

};