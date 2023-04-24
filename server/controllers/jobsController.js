const jobModel = require("../models/jobModel");
const { default: mongoose } = require("mongoose");



module.exports.JobDetails = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const result = await jobModel.findOne({ _id: req.params.id }).populate({
            path: "hrID",
            select: "company name email"
        });
        if (result == null) throw new Error("Can't Find a matching Entry");
        const applicant_id = new mongoose.Types.ObjectId(_id);

        const applicant = await jobModel.exists({ _id: req.params.id, applicants: applicant_id });
        if (applicant) {
            console.log("Success");
            result.isApplied = true;
        }
      
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

