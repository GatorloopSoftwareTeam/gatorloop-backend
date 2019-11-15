const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    //deprecated
    password: {
        type: String,
        minlength: 8
    },
    password_hash: {
        type: String
    },
    password_salt: {
       type: String
    },
    role: {
        type: String,
        default: "user",
        enum: ["admin", "manager", "member", "user"]
    },
    subteam: {
        type: String,
        enum: ["Mech", "ECE", "None", "unassigned"],
        default: "unassigned"
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    email_confirmed: {
        type: Boolean,
        default: false
    }
});

//todo: implement array of po_numbers owned
//todo: change password to hash

exports.Model = mongoose.model("User", Schema);
