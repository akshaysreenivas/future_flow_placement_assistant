const mongoose = require("mongoose");


// Declare the Schema of the Mongo model
const jobSchema = new mongoose.Schema({
    department: { type: String },
    job_type: { type: String },
    job_role: { type: String },
    location: { type: String },
    skills: { type: Array },
    experience: { type: String },
    min_salary: { type: Number },
    max_salary: { type: Number },
    description: { type: String },
    poster: { type: Object },
    company: { type: String },
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
    applicants: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        progress: {
            status: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    }]
});
module.exports = mongoose.model("jobs", jobSchema);