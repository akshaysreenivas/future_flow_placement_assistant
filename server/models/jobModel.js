const mongoose = require("mongoose");



// Declare the Schema of the Mongo model
const jobSchema = new mongoose.Schema({
    department: { type: String },
    job_type: { type: String },
    location: { type: String },
    skills: { type: Array },
    experience: { type: String },
    min_salary: { type: Number },
    max_salary: { type: Number },
    description: { type: String },
    poster: { type: Object },
    hrID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hrManager"
    },
    date: {
        type: Date,
        default: Date.now()
    },
    active: {
        type: Boolean,
        default: true
    },

});




module.exports = mongoose.model("jobs", jobSchema);