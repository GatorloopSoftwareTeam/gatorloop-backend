const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    owner: {
        type: String
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    po_number: {
        type: Number,
        unique: true
    },
    description: {
        type: String
    },
    file_location: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ["New", "Seen", "Submitted", "Approved", "Ordered", "Delivered"],
        default: "New"
    },
    subteam: {
        type: String,
        enum: [],
        default: "unassigned"
    },
    last_updated: {
        type: Date,
        default: Date.now
    }
});

exports.Model = mongoose.model("PurchaseOrder", Schema);
