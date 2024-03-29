const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jobModel = require("../models/jobModel");
const cloudinary = require("../utils/cloudinary");
const sendEmail = require("../config/mailer");



// creating jwt token
const maxAge = 3 * 24 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
};

async function sendOtp(name,email,OTP) {
    // // sending otp to email  
    const Subject = "FutureFlow Your One-Time Password (OTP)";
    const mailOptions = `<p>Dear ${name},</p><br/>
    <p>We're excited to help you with your request. To proceed, please use the following One-Time Password (OTP) </p>
    <p>OTP: ${OTP}</p><br/>
    <p>Please enter this OTP in the designated field </p>
    <p>Best regards,</p><br/>
    <p>FutureFlow team</p><br/>`;
    const MailSend = await sendEmail(email, Subject, mailOptions);
    if (!MailSend.status) throw new Error("server error");
}


function generateOTP() {
    let otp = Math.floor(1000 + Math.random() * 8999);
    otp = otp.toString().padStart(6, "0");
    return otp;
}

// converting date object   to "yyyy-mm-dd"

function convertAllDatesToYMDFormat(datas) {
    console.log("datassss", datas);
    function convertAllDatesToYMDFormat(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    if (datas) {

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

module.exports.signup = async (req, res, next) => {
    try {
        const { name, studentID, email,password } = req.body;
        // throwing error if values are not provided
        if (!name || !studentID || !email || !password ) throw Error("All fields required");
        // checking if the student  already has account
        const alreadyExist = await userModel.findOne({
            $or: [{ studentID }, { email }]
        });
        if (alreadyExist?.studentID === studentID) {
            throw new Error("Student ID already exists");
        } else if (alreadyExist?.email === email) {
            throw new Error("Email ID already exists");
        }

        const OTP = generateOTP();
        await sendOtp(name,email,OTP);
        const newStudent = {    
            name: name,
            studentID: studentID,
            email: email,
            password
        };
        req.session.tempUser=newStudent;
        req.session.Otp=OTP;
        res.status(200).json({ status: true, message: "Email with otp send to "+email });
    } catch (error) {
        next(error);
    }
};

module.exports.otpSubmit = async (req, res, next) => {
    try {
        const { otp } = req.body;

        // throwing error if values are not provided
        if (!otp) throw Error("otp field required");

        if(otp!==req.session.Otp) return res.json({ status: false, message: "Invalid OTP"});
        const newStudent=new userModel(req.session.tempUser);
        await newStudent.save();
        const user = await userModel.findOne({ email: req.session.tempUser.email });
        // calling function to create jwt token 
        const token = createToken(user._id);
        user.password = null;
        user.experiences = convertAllDatesToYMDFormat(user.experiences);
        user.projects = convertAllDatesToYMDFormat(user.projects);
        user.certifications = convertAllDatesToYMDFormat(user.certifications);
        user.education = convertAllDatesToYMDFormat(user.education);
        req.session.destroy();
        res
            .status(200)
            .json({ status: true, message: "signup successfull", user: user, token: token});
    } catch (error) {
        next(error);
    }
};


// fetching all available jobs  

module.exports.Jobs = async (req, res, next) => {
    try {
        const { _id } = req.user;
        // taking the values from the request  
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit || 4;
        const search = req.query.search.replace(/[^@#$^*123456789 ]/g, "");
        const department = req.query.department || "";
        const order = parseInt(req.query.order) || -1;
        const sort = req.query.sort || "date";

        // finding already applied jobs   
        const appliedJobIds = await userModel.findById(_id, { appliedJobs: 1 }).lean();
        const jobIds = appliedJobIds.appliedJobs?.map(job => job._id);
        // query         
        const query = {
            active: true,
            _id: { $nin: jobIds }
        };

        // search option setup    
        if (search) {
            query.$or = [
                { department: { $regex: search, $options: "i" } },
                { job_type: { $regex: search, $options: "i" } },
                { skills: { $regex: search, $options: "i" } },
                { job_role: { $regex: search, $options: "i" } },
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
        const checkuser = await jobModel.findOne({ _id: req.params.id, applicants: { $elemMatch: { id: _id } } }, { hrID: 1 });
        if (checkuser) {
            return res.status(200).json({ status: false, message: "Already applied" });
        }
        // adding user details in the applicants colum of jobs  
        await jobModel.updateOne({ _id: req.params.id }, {
            $addToSet: {
                applicants: {
                    id: _id,
                    progress: {
                        status: "Applied",
                        date: Date.now()
                    }
                }
            }
        });
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
        await jobModel.updateOne({ _id: req.params.id }, { $pull: { applicants: { id: _id } } });
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
        // the ID of the user
        const { _id } = req.user;

        // taking the values from the request  
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit || 4;
        const search = req.query.search.replace(/[^a-zA-Z ]/g, "") || "";
        const department = req.query.department || "";
        const order = parseInt(req.query.order) || -1;
        const sort = req.query.sort || "date";

        // get the applied jobs array of the user
        const appliedJobs = await userModel.findById(_id, "appliedJobs").lean();

        // get an array of job IDs from the appliedJobs array
        const jobIds = appliedJobs.appliedJobs;

        const query = { _id: { $in: jobIds } };

        if (search) {
            query.$or = [
                { department: { $regex: search, $options: "i" } },
                { job_type: { $regex: search, $options: "i" } },
                { job_role: { $regex: search, $options: "i" } },
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

        // find the jobs where the _id is in the jobIds array
        // const jobs = await jobModel.find(query, { "applicants": 0, "hrID": 0 }).lean();
        const jobs = await jobModel.find(query, { "applicants": 0, "hrID": 0 }).sort(sortObject).skip(startIndex).limit(limit);

        const total = await jobModel.countDocuments(query);
        const dep = await jobModel.find({}).distinct("department");
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
        res.status(200).json(response);

    } catch (error) {
        next(error);
    }
};


//  profile building 


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
        updatedUser.projects = convertAllDatesToYMDFormat(updatedUser.projects);
        updatedUser.certifications = convertAllDatesToYMDFormat(updatedUser.certifications);
        updatedUser.education = convertAllDatesToYMDFormat(updatedUser.education);
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
        if (!req.file) throw new Error("can't upload file");
        const response = await cloudinary.uploader.upload(req.file.path);
        const { name } = req.body;
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $push: { attachments: { name, url: response.secure_url, cloudinary_id: response.public_id } } },
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
        if (!attachment) throw new Error("Attachment not found");
        const cloudinaryId = attachment.attachments[0].cloudinary_id;
        await cloudinary.uploader.destroy(cloudinaryId);
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
        // uploading profile photo to cloudinary
        const response = await cloudinary.uploader.upload(req.file.path);

        const user = await userModel.findOne({ _id: _id });
        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $set: { profilePicUrl: response.secure_url, profile_cloudinary_id: response.public_id } },
            { new: true, projection: { password: 0 } }).lean();
        if (req.body.oldProfileImg && updatedUser) {
            // deleting old photo
            await cloudinary.uploader.destroy(user.profile_cloudinary_id);
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
        // uploading cover photo to cloudinary
        const response = await cloudinary.uploader.upload(req.file.path);
        const user = await userModel.findOne({ _id: _id });

        const updatedUser = await userModel.findOneAndUpdate({ _id: _id }, { $set: { coverPicUrl: response.secure_url, cover_cloudinary_id: response.public_id } },
            { new: true, projection: { password: 0 } }).lean();
        // deleting the old pic 
        if (req.body.oldCoverImg && updatedUser) {
            // deleting old photo  
            await cloudinary.uploader.destroy(user.cover_cloudinary_id);
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
        // user.projects = convertAllDatesToYMDFormat(user.projects);
        // user.certifications = convertAllDatesToYMDFormat(user.certifications);
        // user.education = convertAllDatesToYMDFormat(user.education);
        res.status(200).json({ status: true, message: "success", user });
    } catch (error) {
        next(error);
    }
};

// fetching user details for third Party 
module.exports.getUserProfileDetails = async (req, res, next) => {
    try {

        const visitor = req.user;
        const user = await userModel.findOne({ _id: req.params.id }, { password: 0, appliedJobs: 0, status: 0, firstLogin: 0, notification: 0 }).lean();
        user.experiences = convertAllDatesToYMDFormat(user.experiences);
        user.projects = convertAllDatesToYMDFormat(user.projects);
        user.certifications = convertAllDatesToYMDFormat(user.certifications);
        user.education = convertAllDatesToYMDFormat(user.education);
        const userNotification = await userModel.findOne(
            {
                _id: req.params.id,
                notification: {
                    $elemMatch: {
                        visitor_id: visitor._id
                    }
                }
            },
            { notification: 1 }
        ).lean();

        // If an existing notification is found, return
        if (userNotification) {
            return res.status(200).json({ status: true, message: "success", result: user });
        }
        // saving notification of profile view  
        const newNotification = {
            notification_type: "Profile Visit",
            message: `Guess what? HR manager ${visitor.name} from ${visitor.company} just viewed your profile! `,
            date: new Date(),
            isRead: false,
            visitor_id: visitor._id
        };
        await userModel.findByIdAndUpdate(req.params.id, {
            $push: {
                notification: {
                    $each: [newNotification],
                    $sort: { date: -1 }
                }
            }
        });
        res.status(200).json({ status: true, message: "success", result: user });
    } catch (error) {
        next(error);
    }
};

// fetching Notifications 
module.exports.getNotifications = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const notification = await userModel.aggregate([
            { $match: { _id: _id } },
            { $project: { notification: 1 } },
            { $unwind: "$notification" },
            { $sort: { "notification.date": -1 } },
            { $group: { _id: "$_id", notification: { $push: "$notification" } } }
        ]).exec();
        let notifications = { count: 0 };

        const data = notification[0]?.notification;
        notifications.notification = data;
        notifications.count = data?.reduce((count, item) => {
            if (!item.isRead) {
                count++;
            }
            return count;
        }, 0);

        res.status(200).json({ status: true, message: "success", result: notifications });
    } catch (error) {
        next(error);
    }
};


// fetching Notifications 
module.exports.ClearNotification = async (req, res, next) => {
    try {
        const { _id } = req.user;
        await userModel.updateOne({ _id: _id }, { $pull: { notification: { _id: req.params.id } } }).lean();
        res.status(200).json({ status: true, message: "success" });
    } catch (error) {
        next(error);
    }
};

// fetching Notifications 
module.exports.markAsRead = async (req, res, next) => {
    try {
        const { _id } = req.user;
        await userModel.updateMany({ _id: _id }, { $set: { "notification.$[].isRead": true } }).lean();
        res.status(200).json({ status: true, message: "success" });
    } catch (error) {
        next(error);
    }
};

