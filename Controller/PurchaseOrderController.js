const purchaseOrderDAO = require("../DAO/PurchaseOrderDAO");
const net = require("../Util/Net");

//todo: implement permissions check using session (see UserController.js)

exports.getAll = (req, res) => {
    console.log("API GET request called for all purchase orders");

    purchaseOrderDAO.getAllPurchaseOrders().then(function (pos) {
        res.json(net.getSuccessResponse(null, pos));
    }).catch(function (err) {
        console.log("error getting all purchase orders: ", err);
        res.status(500).json(net.getErrorResponse("error retrieving records from database"));
    });
};

exports.getPO = (req, res) => {
    console.log(`API GET request called for purchase order ${req.params.num}`);

    purchaseOrderDAO.getPO(req.params.num).then(function (po) {
        res.json(net.getSuccessResponse(null, po));
    }).catch(function (err) {
        console.log("error getting purchase order: ", err);
        res.status(500).json(net.getErrorResponse("error retrieving records from database"));
    });
};

//todo rehaul
exports.update = (req, res) => {
    console.log(`API PUT request called for purchase order ${req.params.num}`);

    const params = req.body;

    //assume parameters have been sanitized on client side

    //todo: add subteam
    if (Object.keys(params).length === 4) {
        purchaseOrderDAO.updatePO(req.params.num, params["po_number"], params["owner"], params["description"], params["file_location"]).then(function (updatedPO) {
            console.log("PO " + updatedPO.num + " Updated!", updatedPO);
            res.json(net.getSuccessResponse("updated", updatedPO));
        }).catch(function (err) {
            console.log("failed to update record");
            if (err.name === "ValidationError") {
                console.error("Error Validating!", err);
                res.status(422).json(net.getErrorResponse(err));
            } else {
                console.error(err);
                res.status(500).json(net.getErrorResponse("failed to update record"));
            }
        });
    } else {
        res.status(404).json(net.getErrorResponse("Insufficient parameters provided"));
    }
};

exports.create = (req, res) => {
    console.log(`API POST request called for "create PO"`);

    const params = req.body;

    //assume parameters have been sanitized on client side

    //po_number will be generated server side
    //subteam will be gotten from user session

    if (Object.keys(params).length === 4) {
        purchaseOrderDAO.createPurchaseOrder(params["po_number"], params["owner"], params["description"], params["file_location"]).then(function(newPO) {
            console.log("New PO Created!", newPO);
            res.json(net.getSuccessResponse("new po created", newPO));
        }).catch(function(err) {
            if (err.name === "ValidationError") {
                console.error("Error Validating!", err);
                res.status(422).json(net.getErrorResponse(err));
            } else {
                console.error(err);
                res.status(500).json(net.getErrorResponse(err));
            }
        });
    } else {
        res.status(404).json(net.getErrorResponse("Insufficient parameters provided"));
    }
};

exports.delete = (req, res) => {
    console.log(`API DELETE request called for purchase order ${req.params.num}`);

    purchaseOrderDAO.deletePO(req.params.num).then(function (result) {
        if (result.deletedCount === 0) {
            //fail
            res.status(404).json(net.getErrorResponse("could not find record to remove for po number: " + req.params.num));
        } else if (result.deletedCount === 1) {
            //success
            res.json(net.getSuccessResponse("successfully removed record", req.params.num))
        } else {
            //critical error
            res.status(500).json(net.getErrorResponse("critical server error"));
        }
    }).catch(function (err) {
        console.log("failed to remove record: ", err);
        res.status(500).json(net.getErrorResponse("failed to remove record from database"));
    })
};

exports.getBySubteam = (req, res) => {
    console.log(`API GET request called for purchase order from subteam ${req.params.subteam}`);

    purchaseOrderDAO.getBySubteam(req.params.subteam).then(function (pos) {
        res.json(net.getSuccessResponse(null, pos));
    }).catch(function (err) {
        console.log("error getting purchase orders: ", err);
        res.status(500).json(net.getErrorResponse("error retrieving records from database"));
    });
};

exports.getByUser = (req, res) => {
    console.log(`API GET request called for purchase orders from user ${req.params.email}`);

    purchaseOrderDAO.getByUser(req.params.email).then(function (pos) {
        res.json(net.getSuccessResponse(null, pos));
    }).catch(function (err) {
        console.log("error getting purchase orders: ", err);
        res.status(500).json(net.getErrorResponse("error retrieving records from database"));
    });
};
