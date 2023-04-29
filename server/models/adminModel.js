const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    notification: [{
        notification_type: String,
        message: String,
        date: { type: Date, default: Date.now }, // date when the notification was created
        isRead: { type: Boolean, default: false }
    }]
});



module.exports = mongoose.model("admin", AdminSchema);
