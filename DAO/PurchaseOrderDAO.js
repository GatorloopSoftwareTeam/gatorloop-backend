const PurchaseOrder = require("../Model/PurchaseOrder.js").Model;

exports.getAllPurchaseOrders = () => {
    return PurchaseOrder.find({}).exec();
};