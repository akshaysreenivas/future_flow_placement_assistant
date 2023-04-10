const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jobModel = require("../models/jobModel");



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
        if (user.firstLogin) {
            await userModel.updateOne({ email: email }, { status: "Active", firstLogin: false });
        }
        // calling function to create jwt token 
        const token = createToken(user._id);
        user.password = null;
        res
            .status(200)
            .json({ status: true, message: "For security reasons please change your password", user: user, token: token });
    } catch (error) {
        next(error);
    }
};

module.exports.Jobs = async (req, res, next) => {
    try {
        // taking the values from the request  
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const search = req.query.search;
        const department = req.query.department;
        const order = parseInt(req.query.order) || -1;
        const sort = req.query.sort || "date";
        const status = req.query.status;
        // query         
        const query = { active:true };

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
        const dep = await jobModel.find({}).distinct("department");

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