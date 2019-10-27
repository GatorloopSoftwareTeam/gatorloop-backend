const express = require('express');

const purchaseOrderController = require('../Controller/PurchaseOrderController');

let router = express.Router();

router.get('/po', purchaseOrderController.getAll);

module.exports = router;