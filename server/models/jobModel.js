const mongoose = require("mongoose");
// Declare the Schema of the Mongo model
const jobSchema = new mongoose.Schema({
    department: { type: String },
    job_type: { type: String },
    location: { Type: Object },
    skills: { type: Array },
    experience: { type: String },
    min_salary: { type: Number },
    max_salary: { type: Number },
    description: { type: String },
    hrID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hrManager"
    },
    date: {
        type: Date,
        default: new Date()
    },
    active: {
        type: Boolean,
        default: true
    },

});




module.exports = mongoose.model("jobs", jobSchema);