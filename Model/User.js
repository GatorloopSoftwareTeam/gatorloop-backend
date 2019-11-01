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
        enum: ["admin", "manager", "user"]
    },
    purchase_orders: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'PurchaseOrder'
    }],
    subteam: {
        type: String,
        enum: [],
        default: "unassigned"
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

//email confirmation?
//is purchase_orders necessary if /po/user/:email gets all POs for a user
//todo: change password to hash

exports.Model = mongoose.model("User", Schema);
