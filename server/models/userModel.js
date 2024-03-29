const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: String,
    },
    studentID: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    department: {
        type: String,
    
    },
    gender: {
        type: String,
    },
    phone: {
        type: Number
    },
    website: {
        type: String
    },
    profilePicUrl: {
        type: String
    },
    coverPicUrl: {
        type: String
    },
    status: {
        type: String,
        default: "Inactive"
    },
    blocked: {
        type: Boolean,
        default: false
    },

    firstLogin: {
        type: Boolean,
        default: true
    },

    appliedJobs: {
        type: [mongoose.Types.ObjectId],
        ref: "jobs"
    },
    location: {
        type: Object
    },
    experiences: [{
        company: String,
        title: String,
        startDate: Date,
        endDate: Date,
        description: String
    }],
    skills: [{
        name: String,
        level: String
    }],
    education: [{
        institution: String,
        degree: String,
        fieldofStudy: String,
        startDate: Date,
        endDate: Date,
    }],
    certifications: [{
        name: String,
        issuingOrganization: String,
        date: Date
    }],
    projects: [{
        name: String,
        startDate: Date,
        endDate: Date,
        description: String,
        url: String
    }],
    attachments: [{
        name: String,
        url: String,
        cloudinary_id: String,
    }],
    cover_cloudinary_id:{type:String},
    profile_cloudinary_id:{type:String},
    notification: [{
        notification_type: String,
        message: String,
        date: { type: Date, default: Date.now }, // date when the notification was created
        isRead: { type: Boolean, default: false },  // whether the notification is viewed or not
        visitor_id: { type: mongoose.Types.ObjectId }  // if it s a profile visited notification
    }]

});


userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (err) {
        return next(err);
    }
});


module.exports = mongoose.model("users", userSchema);