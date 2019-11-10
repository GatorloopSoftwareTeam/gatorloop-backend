const mongoose = require("mongoose");
const Part = require("./Part.js").Schema;

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
    parts: [Part],
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
    },
    deadline: {
        type: Date
    },
    priority: {
        type: Number,
        enum: [1,2,3,4,5]
    },
    comment: {
        type: String
    },
    total_price: {
        type: Number
    }
});

exports.Model = mongoose.model("PurchaseOrder", Schema);
