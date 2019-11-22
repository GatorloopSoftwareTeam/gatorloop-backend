const purchaseOrderDAO = require("../DAO/PurchaseOrderDAO");
const userController = require("../Controller/UserController");
const net = require("../Util/Net");
const counter = require("../Model/Counter");

const allowed_fields = ["owner", "description", "parts", "status", "subteam", "deadline", "priority", "comment", "total_price"];
exports.allowed_fields = allowed_fields;

const required_fields = ["owner", "description", "parts", "subteam", "deadline", "priority", "total_price"];
exports.required_fields = required_fields;

exports.getAll = (req, res) => {
    console.log("API GET request called for all purchase orders");

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    if (userController.permission_levels[req.user.role] < userController.permission_levels["member"]) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request"));
        return;
    }

    purchaseOrderDAO.getAllPurchaseOrders().then(function (pos) {
        res.json(net.getSuccessResponse(null, pos));
    }).catch(function (err) {
        console.log("error getting all purchase orders: ", err);
        res.status(500).json(net.getErrorResponse("error retrieving records from database"));
    });
};

exports.get = (req, res) => {
    console.log(`API GET request called for purchase order ${req.params.num}`);

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    if (userController.permission_levels[req.user.role] < userController.permission_levels["member"]) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request"));
        return;
    }

    purchaseOrderDAO.getPO(req.params.num).then(function (po) {
        res.json(net.getSuccessResponse(null, po));
    }).catch(function (err) {
        console.log("error getting purchase order: ", err);
        res.status(500).json(net.getErrorResponse("error retrieving records from database"));
    });
};

exports.update = (req, res) => {
    console.log(`API PUT request called for purchase order ${req.params.num}`);

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    //todo: keep array of po_nums in user obj to quickly check if this PO belongs to requesting user
    // if (req.params.email !== req.user.email && userController.permission_levels[req.user.role] < userController.permission_levels["manager"]) {
    //     res.status(401).json(net.getErrorResponse("you are not authorized to make this request; must be your PO or must be at least manager"));
    //     return;
    // }

    if (userController.permission_levels[req.user.role] < userController.permission_levels["manager"]) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; must be at least manager"));
        return;
    }

    //assume parameters have been sanitized on client side
    const params = req.body;
    const keys = Object.keys(params);

    if (keys.length === 0) {
        res.status(422).json(net.getErrorResponse("update request must include at least on parameter"));
        return;
    }

    for (let i = 0; i < keys.length; ++i) {
        if (!allowed_fields.includes(keys[i])) {
            res.status(422).json(net.getErrorResponse(`cannot update field '${keys[i]}' or does not exist`));
            return;
        }
    }

    //validate parts if parts specified
    if (params.parts && !validateParts(params.parts)) {
        res.status(422).json(net.getErrorResponse("invalid parts object"));
        return;
    }

    purchaseOrderDAO.updatePO(req.params.num, params).then(function (updatedPO) {
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
};

exports.create = (req, res) => {
    console.log(`API POST request called for "create PO"`);

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    if (userController.permission_levels[req.user.role] < userController.permission_levels["member"]) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request"));
        return;
    }

    //assume parameters have been sanitized on client side
    const params = req.body;
    const keys = Object.keys(params);

    //if owner not set, get from user session
    if (!params.owner) {
        params.owner = req.user.email;
    }

    //if subteam not set, get from user session
    if (!params.subteam) {
        params.subteam = req.user.subteam;
    }

    if (keys.length < required_fields.length) {
        res.status(422).json(net.getErrorResponse("Insufficient parameters provided"));
        return;
    }

    //check required fields
    for (let i = 0; i < required_fields.length; ++i) {
        if (!keys.includes(required_fields[i])) {
            res.status(422).json(net.getErrorResponse(`'${required_fields[i]}' field is required`));
            return;
        }
    }

    //check other fields allowed
    for (let i = 0; i < keys.length; ++i) {
        if (!allowed_fields.includes(keys[i])) {
            res.status(422).json(net.getErrorResponse(`cannot set field '${keys[i]}' or does not exist`));
            return;
        }
    }

    //validate parts
    if (!validateParts(params.parts)) {
        res.status(422).json(net.getErrorResponse("invalid parts object"));
        return;
    }

    counter.getNextSequenceValue("po_counter").then(function (updatedCounter) {
        params.po_number = updatedCounter.sequence_value;

        purchaseOrderDAO.createPurchaseOrder(params).then(function(newPO) {
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
    }).catch(function (err) {
        console.log("could not get next po number from counter: ", err);
        console.error("could not create PO");
        res.status(500).json(net.getErrorResponse(err));
    });
};

exports.delete = (req, res) => {
    console.log(`API DELETE request called for purchase order ${req.params.num}`);

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    //todo: keep array of po_nums in user obj to quickly check if this PO belongs to requesting user
    // if (req.params.email !== req.user.email && userController.permission_levels[req.user.role] < userController.permission_levels["manager"]) {
    //     res.status(401).json(net.getErrorResponse("you are not authorized to make this request; must be your PO or must be at least manager"));
    //     return;
    // }

    if (userController.permission_levels[req.user.role] < userController.permission_levels["manager"]) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; must be at least manager"));
        return;
    }

    purchaseOrderDAO.deletePO(req.params.num).then(function (result) {
        if (result.deletedCount === 0) {
            //fail
            res.status(404).json(net.getErrorResponse("could not find record to remove for po number: " + req.params.num));
        } else if (result.deletedCount === 1) {
            //success
            res.json(net.getSuccessResponse("successfully removed record", {po_number: req.params.num}))
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

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    if (userController.permission_levels[req.user.role] < userController.permission_levels["member"]) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request"));
        return;
    }

    purchaseOrderDAO.getBySubteam(req.params.subteam).then(function (pos) {
        res.json(net.getSuccessResponse(null, pos));
    }).catch(function (err) {
        console.log("error getting purchase orders: ", err);
        res.status(500).json(net.getErrorResponse("error retrieving records from database"));
    });
};

exports.getByUser = (req, res) => {
    console.log(`API GET request called for purchase orders from user ${req.params.email}`);

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    if (userController.permission_levels[req.user.role] < userController.permission_levels["member"]) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request"));
        return;
    }

    purchaseOrderDAO.getByUser(req.params.email).then(function (pos) {
        res.json(net.getSuccessResponse(null, pos));
    }).catch(function (err) {
        console.log("error getting purchase orders: ", err);
        res.status(500).json(net.getErrorResponse("error retrieving records from database"));
    });
};

exports.updateStatus = (req, res) => {
  //todo
};

//returns true if valid, false otherwise
const validateParts = function (partsJson) {

    //if partsJson is an array, call this method on each object in array
    //when an object is passed, partsJson.length will be undefined which will allow the rest of the method (actual validation) to run
    if (partsJson.length >= 1) {
        for (let i = 0; i < partsJson.length; ++i) {
            if (!validateParts(partsJson[i])) {
                return false;
            }
        }
        return true;
    }

    const required = ["url", "vendor", "price", "quantity", "subtotal"];
    const allowed = ["url", "vendor", "price", "quantity", "subtotal"];
    const types = ["string", "string", "number", "number", "number"];
    const keys = Object.keys(partsJson);

    if (keys.length < required.length) return false;

    //check required fields
    for (let i = 0; i < required.length; ++i) {
        if (!keys.includes(required[i])) {
            return false;
        }
    }

    //check other fields allowed
    for (let i = 0; i < keys.length; ++i) {
        //check value is correct type
        if (typeof partsJson[keys[i]] !== types[i]) {
            return false;
        }
        //check of field is in array of allowed fields
        if (!allowed.includes(keys[i])) {
            return false;
        }
    }

    return true;
};
