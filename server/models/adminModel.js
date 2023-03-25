const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

AdminSchema.statics.login = async function (username, password) {
    if (!username) throw Error("username required");
    if (!password) throw Error("password required");
    const admin = await this.findOne({ username });
    if (admin) {
        const auth = await bcrypt.compare(password, admin.password);
        if (auth) {
            return admin;
        } else {
            throw Error("incorrect password");
        }
    } else {
        throw Error("invalid username");
    }

};

module.exports = mongoose.model("admin", AdminSchema);
