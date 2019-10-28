const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    user_email: {
        type: String,
        unique: true,
        trim: true
    },
    code: {
      type: String,
      unique: true
    },
    is_confirmed: {
        type: Boolean,
        default: false
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

exports.Model = mongoose.model("Invite", Schema);
