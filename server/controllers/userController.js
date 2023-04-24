const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jobModel = require("../models/jobModel");
const Fs = require("fs");

const { default: mongoose } = require("mongoose");



// creating jwt token
const maxAge = 3 * 24 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
};


module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // throwing error if values are not provided
        if (!email || !password) throw Error("All Fields required");
        // finding the user 
        const user = await userModel.findOne({ email: email });
        if (!user) return res.status(401).json({ status: false, message: "incorrect email or password" });
        // comparing password 
        const auth = await bcrypt.compare(password, user.password);
        // sending false response if the password doesn't match
        if (!auth) return res.status(401).json({ status: false, message: "incorrect email or password" });
        // checking whether the user is bolcked or not 
        if (user.blocked) return res.status(200).json({ status: false, message: "Your Account is Temporarly Suspended" });
        // if login success and the if the user is inactive  changing the status to active 

        // calling function to create jwt token 
        const token = createToken(user._id);
        user.password = null;
        res
            .status(200)
            .json({ status: true, message: "success login", user: user, token: token });
    } catch (error) {
        next(error);
    }
};


// fetching all available jobs  

module.exports.Jobs = async (req, res, next) => {
    try {
        const { _id } = req.user;
        // taking the values from the request  
        const page = parseInt(req.query.page);
        const limit = req.query.limit || 4;
        const search = req.query.search;
        const department = req.query.department;
        const order = parseInt(req.query.order) || -1;
        const sort = req.query.sort || "date";
        // query         
        const query = { active: true, applicants: { $not: { $in: [_id] } } };

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

        // page setup      
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // sorting setup   
        let sortObject = {};
        sortObject[sort] = order;

        // quering the job based on the Filter,sort,search  
        const jobs = await jobModel.find(query, { "applicants": 0, "hrID": 0 }).sort(sortObject).skip(startIndex).limit(limit);

        // quering all the distinct departments  
        const dep = await jobModel.find({}).distinct("department");

        // counting the total no of documentes available based on the query   
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

// apply for the job 
module.exports.applyJob = async (req, res, next) => {
    try {
        const { _id } = req.user;
        // checking if the user is already applied for the job 
        const checkuser = await jobModel.findOne({ _id: req.params.id, applicants: { $in: [_id] } });
        if (checkuser) {
            return res.status(200).json({ status: false, message: "Already applied" });
        }
        // adding user details in the applicants colum of jobs  
        await jobModel.updateOne({ _id: req.params.id }, { $addToSet: { applicants: _id } });
        // adding the job details in the user profile
        await userModel.updateOne({ _id: _id }, { $addToSet: { appliedJobs: req.params.id } });

        res.status(200).json({ status: true, message: "successfully applied" });
    } catch (error) {
        next(error);
    }
};




// cancel the jobapplication 
module.exports.cancelJobApplication = async (req, res, next) => {
    try {
        const { _id } = req.user;
        // adding user details in the applicants colum of jobs  
        await jobModel.updateOne({ _id: req.params.id }, { $pull: { applicants: _id } });
        // adding the job details in the user profile
        await userModel.updateOne({ _id: _id }, { $pull: { appliedJobs: req.params.id } });
        res.status(200).json({ status: true, message: "successfully Cancelled", });
    } catch (error) {
        next(error);
    }
};



// fetching jobs which is alredy applied 
module.exports.appliedJobs = async (req, res, next) => {
    try {
        const search = req.query.search;
        // the ID of the user
        // const {_id }=req.user 
        const _id = new mongoose.Types.ObjectId("6433fa5e7540bf7f69de6d70");

        // get the applied jobs array of the user
        const appliedJobs = await userModel.findById(_id, "appliedJobs").lean();

        // get an array of job IDs from the appliedJobs array
        const jobIds = appliedJobs.appliedJobs;

        const query = { _id: { $in: jobIds } };

        if (search) {
            query.$or = [
                { department: { $regex: search, $options: "i" } },
                { job_type: { $regex: search, $options: "i" } },
                { skills: { $regex: search, $options: "i" } },
            ];
        }
        // find the jobs where the _id is in the jobIds array
        const jobs = await jobModel.find(query, { "applicants": 0, "hrID": 0 }).lean();

        res.status(200).json({ status: true, message: "success", jobs });

    } catch (error) {
        next(error);
    }
};


// profile building 


// adding basic info
module.exports.addBasicInfo = async (req, res, next) => {
    try {
        // getting id of the user         
        // const { _id } = req.user;
        const _id = new mongoose.Types.ObjectId("643f94b40ca74eb7bde85b60");

        // getting valus from body    
        const { name, email, gender, phone, website } = req.body;

        // validation    
        if (!name || !email || !gender || !phone || !website) throw new Error("All fields required");

        // updating user details    
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $set: { name, email, gender, phone, website } },
            { new: true, projection: { password: 0 } });

        // sending response    
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};


// changing user password    
module.exports.changePassword = async (req, res, next) => {
    try {
        // getting id of the user         
        // const { _id } = req.user;
        const _id = new mongoose.Types.ObjectId("643f94b40ca74eb7bde85b60");

        // getting the password 
        const { password } = req.body;

        // hashing password   
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // updating user details    
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $set: { password: hashedPassword } },
            { new: true, projection: { password: 0 } });

        // sending response    
        res.status(200).json({ status: true, message: "success", user: updatedUser });
    } catch (error) {
        next(error);
    }
};

// adding experiences  
module.exports.addExperiences = async (req, res, next) => {
    try {
        // getting id of the user         
        // const { _id } = req.user;
        const _id = new mongoose.Types.ObjectId("643f94b40ca74eb7bde85b60");

        const { company, title, startDate, endDate, description } = req.body;
        if (!company || !title || !startDate || !endDate || !description) throw new Error("All fields required");

        // updating user details    

        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $push: { experiences: { company, title, startDate, endDate, description } } },
            { new: true, projection: { password: 0 } });

        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};

// adding skills  
module.exports.addSkills = async (req, res, next) => {
    try {
        // getting id of the user         
        // const { _id } = req.user;
        const _id = new mongoose.Types.ObjectId("643f94b40ca74eb7bde85b60");

        const { name, level } = req.body;
        if (!name || !level) throw new Error("All fields required");
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $push: { skills: { name, level } } },
            { new: true, projection: { password: 0 } });

        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};

// adding education   
module.exports.addEducation = async (req, res, next) => {
    try {
        // getting id of the user         
        // const { _id } = req.user;
        const _id = new mongoose.Types.ObjectId("643f94b40ca74eb7bde85b60");

        const { institution, fieldofStudy, startDate, endDate, description } = req.body;
        if (!institution || !fieldofStudy || !startDate || !endDate || !description) throw new Error("All fields required");
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $push: { education: { institution, fieldofStudy, startDate, endDate, description } } },
            { new: true, projection: { password: 0 } });

        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};
module.exports.addCertifications = async (req, res, next) => {
    try {
        // getting id of the user         
        // const { _id } = req.user;
        const _id = new mongoose.Types.ObjectId("643f94b40ca74eb7bde85b60");

        const { issuingOrganization, name, date, } = req.body;
        if (!issuingOrganization || !name || !date) throw new Error("All fields required");
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $push: { certifications: { issuingOrganization, name, date, } } },
            { new: true, projection: { password: 0 } });

        res.status(200).json({ status: true, message: "success", user: updatedUser });
    } catch (error) {
        next(error);
    }
};
module.exports.addProjects = async (req, res, next) => {
    try {
        // getting id of the user         
        // const { _id } = req.user;
        const _id = new mongoose.Types.ObjectId("643f94b40ca74eb7bde85b60");

        // const { _id } = req.user;
        const { url, name, startDate, endDate, description } = req.body;
        if (!name || !startDate || !endDate || !description) throw new Error("All fields required");
        const newProject = {
            name,
            startDate,
            endDate,
            description,
            url,
        };
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $push: { projects: newProject } },
            { new: true, projection: { password: 0 } });

        res.status(200).json({ status: true, message: "success", user: updatedUser });
    } catch (error) {
        next(error);
    }
};
module.exports.addAttachments = async (req, res, next) => {
    try {
        // getting id of the user         
        // const { _id } = req.user;
        const _id = new mongoose.Types.ObjectId("643f94b40ca74eb7bde85b60");
        const url = "/images/" + req.file.filename;
        if (!url) throw new Error("can't upload image");
        const { name } = req.body;
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $push: { attachments: { name, url } } },
            { new: true, projection: { password: 0 } });

        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};

// updating  profile picture  
module.exports.updateProfilePhoto = async (req, res, next) => {
    try {

        // getting id of the user         
        const { _id } = req.user;
           
        if (!req.file) throw new Error("Can't Upload Profile Photo");

        const url = "/images/" + req.file.filename;
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $set: { profilePicUrl: url } },
            { new: true, projection: { password: 0 } });
        if (req.body.oldProfileImg && updatedUser) {
            Fs.unlink("public" + req.body.oldProfileImg, (err => {
                if (err) throw Error(err);
            }));
        }
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};


// updating cover photo  
module.exports.updateCoverPhoto = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;
        // const _id = new mongoose.Types.ObjectId("643f94b40ca74eb7bde85b60");

        if (!req.file) throw new Error("Can't Upload Cover Photo");

        const url = "/images/" + req.file.filename;

        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $set: { coverPicUrl: url } },
            { new: true, projection: { password: 0 } });
        // deleting the old pic 
        if (req.body.oldCoverImg && updatedUser) {
            Fs.unlinkSync("public" + req.body.oldCoverImg, (err => {
                if (err) throw Error(err);
            }));
        }
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};

// fetching user details 
module.exports.getUserProfile = async (req, res, next) => {
    try {
        const { _id } = req.user;
        // const _id = new mongoose.Types.ObjectId("643f94b40ca74eb7bde85b60");

        const user = await userModel.findOne({ _id: _id }, { password: 0 });
        res.status(200).json({ status: true, message: "success", user });
    } catch (error) {
        next(error);
    }
};
