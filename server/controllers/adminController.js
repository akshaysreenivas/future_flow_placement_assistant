const adminModel = require("../models/adminModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const hrModel = require("../models/hrModel");
const sendEmail = require("../config/mailer");
const jobModel = require("../models/jobModel");
const ExcelJS = require("exceljs");


// creating jwt token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: maxAge });
};

// generating Password
function generatePassword() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$&";
    let password = "";
    for (let i = 0; i < 6; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}



//  Admin login
module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // checking if the values are null
        if (!email || !password) throw Error("All Fields required");
        // matching the account with email  
        const admin = await adminModel.findOne({ email: email });
        // checking if the account  exists
        if (!admin) throw new Error("incorrect email");

        const auth = await bcrypt.compare(password, admin.password);
        
        if (!auth) return res.status(401).json({ status: false, message: "incorrect email or password" });
        // creating the jwt token 
        const token = createToken(admin._id);
        res.status(200).json({ status: true, message: "Login Success", token: token });
    } catch (err) {
        next(err);
    }
};

// admin adding users
module.exports.addStudents = async (req, res, next) => {
    try {
        const { username, studentID, email, department } = req.body;

        // checking if the values are null
        if (!username || !studentID || !email || !department) throw Error("All fields required");
        // checking if the student  already has account
        const alreadyExist = await userModel.findOne({
            $or: [{ studentID }, { email }]
        });
        if (alreadyExist?.studentID === studentID) {
            throw new Error("Student ID already exists");
        } else if (alreadyExist?.email === email) {
            throw new Error("Email ID already exists");
        }
        // generating Password
        const password = generatePassword();
        // sending temporary password via email  
        const Subject = "Your temporary password for Future Flow Student Placement website";
        const mailOptions = `<p>Dear ${username},</p><br/>
        <p>Welcome to the Student Placement Cell website! You have been successfully registered as a student.</p><br/>
        <p>Your temporary password is: ${password}</p><br/>
        <p>Please use this password to log in to the website. You will be prompted to change your password after logging in for the first time.</p><br/>
        <p>Best regards,</p><br/>
        <p>Future Flow Student Placement team</p><br/>`;

        const MailSend = await sendEmail(email, Subject, mailOptions);
        if (!MailSend.status) throw new Error("server error");
        const newStudent = new userModel({
            name: username,
            studentID: studentID,
            email: email,
            password: password,
            department: department
        });

        await newStudent.save();
        res.status(200).json({ status: true, message: "successfully added user" });
    } catch (error) {
        next(error);
    }


};


// Admin adding hr managers
module.exports.addHrManager = async (req, res, next) => {
    try {
        const { username, email, company } = req.body;
        if (!username || !email || !company) throw new Error("All fields required");
        const alreadyExist = await hrModel.findOne({ email: email });
        if (alreadyExist !== null) throw new Error("already exists");
        // generating Password
        const password = generatePassword();
        // sending temporary password via email  
        const subject = "Your temporary password for Future Flow Student Placement website";
        const mailOptions = `<p>Dear ${username},</p><br/>
        <p>Welcome to the Student Placement Cell website! You have been successfully registered as a HR manager.</p><br/>
        <p>Your temporary password is: ${password}</p>
        <p>Please use this password to log in to the website. You will be prompted to change your password after logging in for the first time.</p>
        <p>Best regards,</p>
        <p>Future Flow Student Placement team</p><br/>`;
        const MailSend = await sendEmail(email, subject, mailOptions);
        if (!MailSend.status) throw new Error("server error");
        const newHr = new hrModel({
            name: username,
            email: email,
            company: company,
            password: password
        });
        await newHr.save();
        res.status(200).json({ status: true, message: "successfully added user" });
    } catch (error) {
        next(error);
    }
};

module.exports.getAllStudents = async (req, res, next) => {
    try {

        // taking the values from the request  
        const page = parseInt(req.query.page);
        const limit = req.query.limit || 10;
        const search = req.query.search.replace(/[^a-zA-Z ]/g, "");
        const department = req.query.department;


        // query         
        const query = {};

        // search option setup    
        if (search) {
            query.$or = [
                { department: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { studentID: { $regex: search, $options: "i" } },
            ];
        }

        // if there is a filter

        //  filter by status  
        if (department) {
            query.department = department;
        }
        const total = await userModel.countDocuments(query);

        // page setup      
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const students = await userModel.find(query, { name: 1, email: 1, department: 1, studentID: 1, status: 1 }).skip(startIndex).limit(limit);

        const departments = await userModel.find({}).distinct("department");

        //         // constructing the response   
        const response = { status: true, total, limit, page, departments, result: students };

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
module.exports.getHRManagers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit || 5;
        const search = req.query.search || "";
        const filter = req.query.hiring || "";

        // query         
        const query = {};

        // search option setup    
        if (search) {
            query.$or = [
                { company: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        // if there is a filter

        //  filter by status  
        if (filter) {
            if (filter === "true") {
                query.active = true;
            } else if (filter === "false") {
                query.active = false;
            }
        }
        const total = await hrModel.countDocuments(query);

        // page setup      
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const hrManagers = await hrModel.find(query, { password: 0 }).skip(startIndex).limit(limit);

        // constructing the response   
        const response = { status: true, total, limit, page, result: hrManagers };

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
module.exports.changeUserStatus = async (req, res, next) => {
    try {
        const { status, id } = req.body;
        const result = await userModel.findByIdAndUpdate({ _id: id }, { $set: { blocked: status } }).exec();
        if (result == null) throw new Error("Can't Find a matching Entry");
        res.status(200).json({ status: true, message: "Successfully updated" });
    } catch (error) {
        next(error);
    }

};

// blocking or unblocking hr manager 
module.exports.changeHRStatus = async (req, res, next) => {
    try {
        const { status, id } = req.body;
        const result = await hrModel.findByIdAndUpdate({ _id: id }, { $set: { blocked: status } }).exec();
        if (result == null) throw new Error("Can't Find a matching Entry");
        res.status(200).json({ status: true, message: "Successfully updated" });
    } catch (error) {
        next(error);
    }
};




// fetching nessary datas for admin dashboard
module.exports.getDashboardDatas = async (req, res, next) => {
    try {
        const hrManagers = await hrModel.countDocuments({}).exec();
        const students = await userModel.countDocuments({}).exec();
        const jobs = await jobModel.countDocuments({}).exec();

        let analysis = await jobModel.aggregate([
            // unwind the applicants array
            { $unwind: "$applicants" },

            // group by year, month, and status
            {
                $group: {
                    _id: {
                        year: { $year: "$applicants.progress.date" },
                        month: { $month: "$applicants.progress.date" },
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
                    year: "$_id.year",
                    month: "$_id.month",
                    status: "$_id.status",
                    count: "$count"
                }
            },

            // sort by year and month
            { $sort: { year: 1, month: 1 } },
        ]);

        const placements = await jobModel.aggregate([
            // unwind the applicants array
            { $unwind: "$applicants" },

            // group by  status
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

            // sort by year and month
            { $sort: { year: 1, month: 1 } },

            // group by status and sum the count
            {
                $group: {
                    _id: "$status",
                    total: { $sum: "$count" }
                }
            }
        ]);
        const companys = await jobModel.aggregate([
            { "$unwind": "$applicants" },
            // Match only applicants with a "Placed" status
            { $match: { "applicants.progress.status": "Placed" } },
            {
                $group: {
                    _id: "$company",
                    count: { $sum: 1 }
                }
            },
            // Project the fields to remove the "_id" and rename the remaining fields
            {
                $project: {
                    _id: 0,
                    company: "$_id",
                    count: "$count"
                }
            }


        ]);
        const totalPlacements = placements[0]?.total ?? 0;
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        analysis.map(item => item.month = months[item.month - 1]);

        let response = { status: true, students, hrManagers, jobs, analysis, totalPlacements, companys };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};




// fetching datas for dashboard  
module.exports.downloadDashboardDatas = async (req, res, next) => {
    try {
        // getting id of the user         
        const placements = await jobModel.aggregate([
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
                    company: "$company",
                    job_type: "$job_type",
                    name: { $arrayElemAt: ["$applicant.name", 0] },
                    email: { $arrayElemAt: ["$applicant.email", 0] },
                    salary: { $concat: [{ $toString: "$min_salary" }, "-", { $toString: "$max_salary" }] }
                }
            }



        ]);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Placements");

        worksheet.columns = [
            { header: "Title", key: "title", width: 25 },
            { header: "company", key: "company", width: 25 },
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
                company: job.company
            });
        });
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=placements.xlsx");
        await workbook.xlsx.write(res);
    } catch (error) {
        next(error);
    }
};