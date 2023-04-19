const jobModel = require("../models/jobModel");



module.exports.JobDetails = async (req, res, next) => {
    try {
        console.log("jbhbhhb");
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

