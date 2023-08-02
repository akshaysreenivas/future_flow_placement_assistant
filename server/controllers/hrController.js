// importing modules 
const hrModel = require("../models/hrModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jobModel = require("../models/jobModel");
const userModel = require("../models/userModel");
const excelJS = require("exceljs");
const cloudinary = require("../utils/cloudinary");


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
        if (!user) return res.status(401).json({ status: false, message: "incorrect email" });
        // comparing password 
        const auth = await bcrypt.compare(password, user.password);
        // sending false response if the password doesn't match
        if (!auth) return res.status(401).json({ status: false, message: "incorrect password" });
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
        console.log(req.file);
        if (!req.file) throw new Error("can't upload image");
        // uploading job poster to cloudinary     
        const response = await cloudinary.uploader.upload(req.file.path);
        if (!response) throw new Error("image upload failed");

        const hrID = req.user.id;
        let { department, job_type, location, skills, experience, min_salary, max_salary, job_role, description } = req.body;
        // checking if the values are null
        if (!experience) {
            experience = "No Prior Experience Needed";
        }
        if (!department || !job_type || !job_role || !location || !experience || !min_salary || !max_salary || !description) throw Error("All fields required");
        const company = await hrModel.findOne({ _id: hrID }, { company: 1 });
        const newJob = new jobModel({
            department: department,
            job_type: job_type,
            job_role: job_role,
            skills: skills,
            experience: experience,
            min_salary: min_salary,
            max_salary: max_salary,
            description: description,
            location: location,
            company: company.company,
            hrID: hrID,
            poster: {
                cloudinary_id: response.public_id,
                path: response.secure_url
            }
        });
        await newJob.save();
        // await hrModel.
        await hrModel.updateOne({ _id: hrID }, { $set: { active: true } });

        res.status(200).json({ status: true, message: "Successfully Added Job" });
    } catch (error) {
        next(error);
    }
};

// Editing Jobs    
module.exports.editJob = async (req, res, next) => {
    try {

        const { id } = req.params;
        let { department, job_type, location, skills, experience, min_salary, max_salary, job_role, description } = req.body;
        // checking if the values are null
        if (!experience) {
            experience = "No Prior Experience Needed";
        }

        if (!department || !job_type || !job_role || !location || !experience || !min_salary || !max_salary || !description) throw Error("All fields required");

        let imgpath;
        let cloudinaryId;
        // fetching details to delete image      
        const job = await jobModel.findOne({ _id: id });
        if (req.file != null) {
            await cloudinary.uploader.destroy(job.poster.cloudinary_id);
            const result = await cloudinary.uploader.upload(req.file.path);
            cloudinaryId = result.public_id;
            imgpath = result.secure_url;
        } else {
            imgpath = job.poster.path;
            cloudinaryId = job.poster.cloudinary_id;
        }



        await jobModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                department: department,
                job_type: job_type,
                job_role: job_role,
                location: location,
                skills: skills,
                experience: experience,
                min_salary: min_salary,
                max_salary: max_salary,
                description: description,
                poster: {path:imgpath,cloudinary_id:cloudinaryId}
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
        const search = req.query.search.replace(/[^a-zA-Z ]/g, "");
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
        const jobs = await jobModel.find(query).sort(sortObject).skip(startIndex).limit(limit).lean();

        // quering all the distinct departments  
        const dep = await jobModel.find({ hrID: hrID }).distinct("department");
        jobs.map((item) => item.applicants = item.applicants?.length);
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

module.exports.getCandidates = async (req, res, next) => {
    try {

        const statusFilter = req.query.filter;

        const jobId = req.params.id;

        let query = { _id: jobId };
        let projection = { applicants: 1 };

        if (statusFilter) {
            // Use $filter to filter the applicants array by status
            projection["applicants"] = {
                $filter: {
                    input: "$applicants",
                    as: "applicant",
                    cond: { $eq: ["$$applicant.progress.status", statusFilter] }
                }
            };
        }

        const result = await jobModel.findOne(query, projection)
            .populate({
                path: "applicants.id",
                select: { name: 1, email: 1, studentID: 1, phone: 1, profilePicUrl: 1 }
            })
            .exec();


        const data = result.applicants.length ? result.applicants : [];


        res.status(200).json({ status: true, message: "success", result: data });
    } catch (error) {
        next(error);
    }

};

module.exports.changeCandidateStatus = async (req, res, next) => {
    try {
        const { candidate_id, status } = req.body;

        // Find the job posting document by ID
        const updateObj = {
            $set: {
                "applicants.$.progress.status": status,
                "applicants.$.progress.date": Date.now(),
                "applicants.$.rejected": status === "Rejected",
            },
        };

        // adding user details in the applicants colum of jobs  
        const job = await jobModel.findOneAndUpdate({ _id: req.params.id, "applicants.id": candidate_id }, updateObj, { new: true });

        // notifying user about the status change   
        let message;
        if (status === "Rejected") {
            message = `oops! your job application as a ${job.job_role}  was rejected !,Its time to sharpen your skills`;
        } else if (status === "Short Listed") {
            message = `Congratulations! We are pleased to inform you that you have been shortlisted for the position of ${job.job_role} at ${job.company}.`;
        } else if (status === "Placed") {
            message = `We are delighted to inform you that you have been selected for the position of ${job.job_role} at ${job.company}. Congratulations on your new job! `;
        }
        const newNotification = {
            notification_type: "Job Status",
            message: message,
            date: new Date(),
            isRead: false,
        };
        await userModel.findByIdAndUpdate(candidate_id, {
            $push: {
                notification: {
                    $each: [newNotification],
                    $sort: { date: -1 }
                }
            }
        });

        res.status(200).json({ status: true, message: "Success" });
    } catch (error) {
        next(error);
    }
};




// changing user password    
module.exports.changeHRPassword = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;

        // getting the password 
        const { password } = req.body;
        if (!password) throw new Error("Password required");

        // hashing password   
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // updating Hr Password    
        await hrModel.findOneAndUpdate({ _id: _id },
            { $set: { password: hashedPassword } }).lean();
        // sending response    
        res.status(200).json({ status: true, message: "success" });
    } catch (error) {
        next(error);
    }
};



// fetching datas for dashboard  
module.exports.getHRDashboardDatas = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;
        const jobs = await jobModel.countDocuments({ hrID: _id }).exec();

        // department wise hirings  
        let analysis = await jobModel.aggregate([
            { $match: { hrID: _id } },

            // unwind the applicants array
            { $unwind: "$applicants" },

            // Match only applicants with a "Placed" status
            { $match: { "applicants.progress.status": "Placed" } },

            // group by department
            {
                $group: {
                    _id: {
                        department: "$department"
                    },
                    count: { $sum: 1 }
                }
            },
            //   Project the fields to remove the "_id" and rename the remaining fields
            {
                $project: {
                    _id: 0,
                    department: "$_id.department",
                    count: "$count"
                }
            }

        ]);

        // total placements   
        const placements = await jobModel.aggregate([
            { $match: { hrID: _id } },
            // unwind the applicants array
            { $unwind: "$applicants" },

            {
                $group: {
                    _id: {
                        status: "$applicants.progress.status"
                    },
                    count: { $sum: 1 }
                }
            },

            // match the shortlisted and placed statuses
            { $match: { "_id.status": { $in: ["Placed"] } } },

            // project the required fields
            {
                $project: {
                    _id: 0,
                    count: "$count"
                }
            },


            // group by status and sum the count
            {
                $group: {
                    _id: "$status",
                    total: { $sum: "$count" }
                }
            }
        ]);

        // no of appliants by dtatus  
        let statusCount = await jobModel.aggregate([
            { $match: { hrID: _id } },
            { $unwind: "$applicants" },
            {
                $group: {
                    _id: "$applicants.progress.status",
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    countsByStatus: {
                        $push: {
                            status: "$_id",
                            count: "$count"
                        }
                    },
                    total: { $sum: "$count" }
                }
            }

        ]);


        const departments = await jobModel.countDocuments({ hrID: _id }).distinct("department");
        const totaldepartments = departments.length;


        const totalPlacements = placements[0]?.total ?? 0;
        let totalApplicants = statusCount[0]?.total ?? 0;
        statusCount = statusCount[0]?.countsByStatus ?? [];
        const response = { status: true, jobs, analysis, totalPlacements, totaldepartments, totalApplicants, statusCount };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};



// fetching datas for dashboard  
module.exports.downloadHrDashboardDatas = async (req, res, next) => {
    try {
        // getting id of the user         
        const { _id } = req.user;


        const placements = await jobModel.aggregate([
            { $match: { hrID: _id } },
            // unwind the applicants array
            { $unwind: "$applicants" },

            // match the shortlisted and placed statuses
            { $match: { "applicants.progress.status": { $in: ["Placed"] } } },
            // lookup the name and email fields from the users collection
            {
                $lookup: {
                    from: "users",
                    localField: "applicants.id",
                    foreignField: "_id",
                    as: "applicant"
                }
            },
            // project the required fields
            {
                $project: {
                    _id: 0,
                    title: "$job_role",
                    department: "$department",
                    job_type: "$job_type",
                    name: { $arrayElemAt: ["$applicant.name", 0] },
                    email: { $arrayElemAt: ["$applicant.email", 0] },
                    salary: { $concat: [{ $toString: "$min_salary" }, "-", { $toString: "$max_salary" }] }
                }
            }



        ]);


        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Placements");

        worksheet.columns = [
            { header: "Title", key: "title", width: 25 },
            { header: "department", key: "department", width: 25 },
            { header: "name", key: "name", width: 25 },
            { header: "email", key: "email", width: 30 },
            { header: "salary", key: "salary", width: 25 },
            { header: "job_type", key: "job_type", width: 25 },
        ];
        placements.forEach(job => {
            worksheet.addRow({
                title: job.title, department: job.department,
                name: job.name, email: job.email,
                salary: job.salary, job_type: job.job_type,
            });
        });
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=placements.xlsx");
        await workbook.xlsx.write(res);

    } catch (error) {
        next(error);
    }
};