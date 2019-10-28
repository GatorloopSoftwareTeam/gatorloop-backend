const express = require('express');

const userRoutes = require("./UserRoutes");
const purchaseOrderRoutes = require("./PurchaseOrderRoutes")

const router = express.Router();

//router.get('/', function(req, res) {
//    res.json({message: 'Welcome to the database api'});
//});

module.exports = [router, userRoutes, purchaseOrderRoutes];