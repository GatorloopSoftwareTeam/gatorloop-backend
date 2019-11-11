const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    url: String,
    vendor: String,
    price: Number,
    quantity: Number
});

exports.Schema = Schema;
