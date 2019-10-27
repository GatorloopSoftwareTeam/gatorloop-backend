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
    password: {
        type: String,
        minlength: 8
    },
    role: {
        type: String,
        default: "user",
        enum: ["admin", "user"]
    },
    purchase_orders: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'PurchaseOrder'
    }]
});

exports.Model = mongoose.model("User", Schema);
