const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jobModel = require("../models/jobModel");
const Fs = require("fs");



// creating jwt token
const maxAge = 3 * 24 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
};



// converting date object   to "yyyy-mm-dd"

function convertAllDatesToYMDFormat(datas) {
    function convertAllDatesToYMDFormat(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    return datas.map(exp => {
        if (exp.date) {
            exp.date = convertAllDatesToYMDFormat(new Date(exp.date));
        }
        if (exp.startDate && exp.endDate) {
            exp.startDate = convertAllDatesToYMDFormat(new Date(exp.startDate));
            exp.endDate = convertAllDatesToYMDFormat(new Date(exp.endDate));
        } else if (exp.startDate) {
            exp.startDate = convertAllDatesToYMDFormat(new Date(exp.startDate));
        }

        return exp;
    });
}





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
        user.experiences = convertAllDatesToYMDFormat(user.experiences);
        user.projects = convertAllDatesToYMDFormat(user.projects);
        user.certifications = convertAllDatesToYMDFormat(user.certifications);
        user.education = convertAllDatesToYMDFormat(user.education);
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

        // res.status(200).json({ status: true, message: "successfully applied" });
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
        const { _id } = req.user;

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
        const { _id } = req.user;

        // getting valus from body    
        const { name, email, gender, phone, website, State, district } = req.body;
        const location = { state: State, district };
        // updating user details    
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $set: { name, email, gender, phone, website, location } },
            { new: true, projection: { password: 0 } }).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
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
        const { _id } = req.user;

        // getting the password 
        const { password } = req.body;

        // hashing password   
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // updating user details    
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $set: { password: hashedPassword, firstLogin: false } },
            { new: true, projection: { password: 0 } }).lean();

        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
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
        const { _id } = req.user;

        const { company, title, startDate, endDate, description } = req.body;
        if (!company || !title || !startDate || !endDate || !description) throw new Error("All fields required");

        // updating user details    

        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $push: { experiences: { company, title, startDate, endDate, description } } },
            { new: true, projection: { password: 0 } }).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};
// editing experience  
module.exports.editExperience = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;

        const { company, title, startDate, endDate, description } = req.body;
        if (!company || !title || !startDate || !endDate || !description) throw new Error("All fields required");
        // updating user details    

        const updatedUser = await userModel.findOneAndUpdate(
            { _id: _id, "experiences._id": req.params.id },
            {
                $set: {
                    "experiences.$.company": company,
                    "experiences.$.title": title,
                    "experiences.$.startDate": startDate,
                    "experiences.$.endDate": endDate,
                    "experiences.$.description": description,
                },
            },
            { new: true, projection: { password: 0 } }
        ).lean();

        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};
// deleting experience 
module.exports.deleteExperience = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;
        const id = req.params.id;

        // updating user details    
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $pull: { experiences: { _id: id } } },
            { new: true, projection: { password: 0 } }).lean();

        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        let j = await convertAllDatesToYMDFormat(updatedUser.experiences);

        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        console.log("after", j);
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};

// adding skills  
module.exports.addSkills = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;

        const { name, level } = req.body;
        if (!name || !level) throw new Error("All fields required");
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $push: { skills: { name, level } } },
            { new: true, projection: { password: 0 } }).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        console.log("updatedUser", updatedUser);
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};
// editing skills  
module.exports.editSkill = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;

        const { name, level } = req.body;
        if (!name || !level) throw new Error("All fields required");
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: _id, "skills._id": req.params.id },
            {
                $set: {
                    "skills.$.name": name,
                    "skills.$.level": level
                },
            },
            { new: true, projection: { password: 0 } }
        ).lean();

        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        console.log("updatedUser", updatedUser);
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};

// delete skill  
module.exports.deleteSkill = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;

        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $pull: { skills: { _id: req.params.id } } },
            { new: true, projection: { password: 0 } }).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        console.log("updatedUser", updatedUser);
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};

// adding education   
module.exports.addEducation = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;
        const { institution, fieldofStudy, degree, startDate, endDate } = req.body;
        if (!institution || !fieldofStudy || !startDate || !endDate || !degree) throw new Error("All fields required");
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $push: { education: { institution, fieldofStudy, degree, startDate, endDate } } },
            { new: true, projection: { password: 0 } }).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};
// editing education   
module.exports.editEducation = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;
        const { institution, fieldofStudy, degree, startDate, endDate } = req.body;
        if (!institution || !fieldofStudy || !startDate || !endDate || !degree) throw new Error("All fields required");
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: _id, "education._id": req.params.id },
            {
                $set: {
                    "education.$.institution": institution,
                    "education.$.fieldofStudy": fieldofStudy,
                    "education.$.degree": degree,
                    "education.$.endDate": endDate,
                    "education.$.startDate": startDate,
                },
            },
            { new: true, projection: { password: 0 } }
        ).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};
// delete education   
module.exports.deleteEducation = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;

        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $pull: { education: { _id: req.params.id } } },
            { new: true, projection: { password: 0 } }).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};

// adding certifications
module.exports.addCertifications = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;

        const { issuingOrganization, name, date, } = req.body;
        if (!issuingOrganization || !name || !date) throw new Error("All fields required");
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $push: { certifications: { issuingOrganization, name, date, } } },
            { new: true, projection: { password: 0 } }).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });
    } catch (error) {
        next(error);
    }
};
// adding certifications
module.exports.editCertification = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;

        const { issuingOrganization, name, date, } = req.body;
        if (!issuingOrganization || !name || !date) throw new Error("All fields required");
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: _id, "certifications._id": req.params.id },
            {
                $set: {
                    "certifications.$.issuingOrganization": issuingOrganization,
                    "certifications.$.name": name,
                    "certifications.$.date": date
                },
            },
            { new: true, projection: { password: 0 } }
        ).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });
    } catch (error) {
        next(error);
    }
};

// delete certifications
module.exports.deleteCertification = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;


        const updatedUser = await userModel.findOneAndUpdate({ _id: _id },
            { $pull: { certifications: { _id: req.params.id } } },
            { new: true, projection: { password: 0 } }).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });
    } catch (error) {
        next(error);
    }
};

// adding projects 
module.exports.addProjects = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;

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
            { new: true, projection: { password: 0 } }).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });
    } catch (error) {
        next(error);
    }
};
// editing project 
module.exports.editProject = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;

        // const { _id } = req.user;
        const { url, name, startDate, endDate, description } = req.body;
        if (!name || !startDate || !endDate || !description) throw new Error("All fields required");

        const updatedUser = await userModel.findOneAndUpdate(
            { _id: _id, "projects._id": req.params.id },
            {
                $set: {
                    "projects.$.name": name,
                    "projects.$.url": url,
                    "projects.$.startDate": startDate,
                    "projects.$.endDate": endDate,
                    "projects.$.description": description,
                },
            },
            { new: true, projection: { password: 0 } }
        ).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });
    } catch (error) {
        next(error);
    }
};
// delete project 
module.exports.deleteProject = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $pull: { projects: { _id: req.params.id } } },
            { new: true, projection: { password: 0 } }).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });
    } catch (error) {
        next(error);
    }
};

// adding attachments    
module.exports.addAttachments = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;
        const url = "/images/" + req.file.filename;
        if (!url) throw new Error("can't upload image");
        const { name } = req.body;
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $push: { attachments: { name, url } } },
            { new: true, projection: { password: 0 } }).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};

// deleting attachment
module.exports.deleteAttachment = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;
        const attachment = await userModel.findOne({ _id: _id, "attachments._id": req.params.id }, { "attachments.$": 1 }).lean();
        console.log(attachment);
        if (!attachment) throw new Error("Attachment not found");
        const url = attachment.attachments[0].url;
        Fs.unlink("public" + url, (err) => {
            if (err) throw err;
        });
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $pull: { attachments: { _id: req.params.id } } },
            { new: true, projection: { password: 0 } }).lean();
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
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
            { new: true, projection: { password: 0 } }).lean();
        if (req.body.oldProfileImg && updatedUser) {
            Fs.unlink("public" + req.body.oldProfileImg, (err => {
                if (err) throw Error(err);
            }));
        }
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
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
        if (!req.file) throw new Error("Can't Upload Cover Photo");
        const url = "/images/" + req.file.filename;
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $set: { coverPicUrl: url } },
            { new: true, projection: { password: 0 } }).lean();
        // deleting the old pic 
        if (req.body.oldCoverImg && updatedUser) {
            Fs.unlinkSync("public" + req.body.oldCoverImg, (err => {
                if (err) throw Error(err);
            }));
        }
        updatedUser.experiences = convertAllDatesToYMDFormat(updatedUser.experiences);
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
        res.status(200).json({ status: true, message: "success", user: updatedUser });

    } catch (error) {
        next(error);
    }
};





// fetching user details 
module.exports.getUserProfile = async (req, res, next) => {


    try {

        const { _id } = req.user;
        const user = await userModel.findOne({ _id: _id }, { password: 0 }).lean();
        user.experiences = convertAllDatesToYMDFormat(user.experiences);
        user.projects = convertAllDatesToYMDFormat(user.projects);
        user.certifications = convertAllDatesToYMDFormat(user.certifications);
        user.education = convertAllDatesToYMDFormat(user.education);
        res.status(200).json({ status: true, message: "success", user });
    } catch (error) {
        next(error);
    }
};
