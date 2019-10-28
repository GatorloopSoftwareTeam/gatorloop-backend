const purchaseOrderDAO = require("../DAO/PurchaseOrderDAO");

exports.getAll = (req, res) => {
    console.log("API GET request called for all purchase orders");

    purchaseOrderDAO.getAllPurchaseOrders().then(function (pos) {
        res.send(pos);
    }).catch(function (err) {
        console.log("error getting all purchase orders: ", err);
        res.status(500).json({error: 'error retrieving records from database'});
    });
};