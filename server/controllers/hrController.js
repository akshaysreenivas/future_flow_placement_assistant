// importing modules 
const hrModel = require("../models/hrModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jobModel = require("../models/jobModel");
const Fs = require("fs");

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
        if (!req.file) throw new Error("can't upload image");
        const hrID = req.user.id;
        let { department, job_type, location, skills, experience, min_salary, max_salary, description } = req.body;
        // checking if the values are null
        if (!experience) {
            experience = "No Prior Experience Needed";
        }
        console.log("location", location);
        if (!department || !req.file || !job_type || !location || !experience || !min_salary || !max_salary || !description) throw Error("All fields required");
        const imgUrl = "/images/" + req.file.filename;
        const newJob = new jobModel({
            department: department,
            job_type: job_type,
            skills: skills,
            experience: experience,
            min_salary: min_salary,
            max_salary: max_salary,
            description: description,
            location: location,
            hrID: hrID,
            poster: imgUrl
        });
        await newJob.save();
        res.status(200).json({ status: true, message: "Successfully Added Job" });
    } catch (error) {
        next(error);
    }
};

// Editing Jobs    
module.exports.editJob = async (req, res, next) => {
    try {

        const { id } = req.params;
        let { department, job_type, location, skills, experience, min_salary, max_salary, description } = req.body;
        // checking if the values are null
        if (!experience) {
            experience = "No Prior Experience Needed";
        }

        if (!department || !job_type || !location || !experience || !min_salary || !max_salary || !description) throw Error("All fields required");
        let imgUrl;
        if (req.file) {
            imgUrl = "/images/" + req.file.filename;
            Fs.unlinkSync("public" + req.body.poster, (err => {
                if (err) throw Error(err);
            }));
        } else {
            imgUrl = req.body.poster;

        }


        await jobModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                department: department,
                job_type: job_type,
                location: location,
                skills: skills,
                experience: experience,
                min_salary: min_salary,
                max_salary: max_salary,
                description: description,
                poster: imgUrl
            }
        });
        res.status(200).json({ status: true, message: "Successfully edited Job" });
    } catch (error) {
        next(error);
    }
};

module.exports.getAllJobPosts = async (req, res, next) => {
    try {
        // taking the values from the request  
        const hrID = req.user.id;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const search = req.query.search;
        const department = req.query.department;
        const order = parseInt(req.query.order) || -1;
        const sort = req.query.sort || "date";
        const status = req.query.status;
        // query         
        const query = { hrID: hrID };

        // search option setup    
        if (search) {
            query.$or = [
                { department: { $regex: search, $options: "i" } },
                { job_type: { $regex: search, $options: "i" } },
                { skills: { $regex: search, $options: "i" } },
            ];
        }

        //  filter by department  
        if (department) {
            query.department = department;
        }
        // filter by status
        if (status) {
            query.active = status;
        }
        // page setup      
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // sorting setup   
        let sortObject = {};
        sortObject[sort] = order;

        // quering the job based on the FileSystemEntry,sort,search  
        const jobs = await jobModel.find(query).sort(sortObject).skip(startIndex).limit(limit);

        // quering all the distinct departments  
        const dep = await jobModel.find({ hrID: hrID }).distinct("department");

        // counting the total no of documentes available based on the filerstions   
        const total = await jobModel.countDocuments(query);
        // constructing the response   
        const response = { status: true, total, page, limit, department: dep, result: jobs };

        // finding if a next page is available  
        if (endIndex < total)
            response.next = {
                page: page + 1,
                limit: limit
            };

        // finding if previous page exists  
        if (startIndex > 0) {
            response.previous = {
                page: page - 1,
                limit: limit
            };
        }

        // finally sending the response  
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

};
module.exports.JobDetails = async (req, res, next) => {
    try {
        const result = await jobModel.findOne({ _id: req.params.id }).populate({
            path: "hrID",
            select: "company",
        }).lean();
        if (result == null) throw new Error("Can't Find a matching Entry");
        result.date = result.date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        res.status(200).json({ status: true, result });
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