const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    studentID: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    status:{
        type:String,
        default:"Inactive"
    },
    blocked:{
        type:Boolean,
        default:false
    },
    skills: {
        type: Array
    },
    projects: {
        type: Array
    }
});


userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password"))return next(); 
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