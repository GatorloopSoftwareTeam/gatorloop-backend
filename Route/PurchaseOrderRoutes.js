const express = require('express');

const purchaseOrderController = require('../Controller/PurchaseOrderController');

let router = express.Router();

//core
router.get('/po', purchaseOrderController.getAll);
router.get('/po/:num', purchaseOrderController.getPO);
router.put('/po/:num', purchaseOrderController.update);
router.post('/po', purchaseOrderController.create);
router.delete('/po/:num', purchaseOrderController.delete);

//utility
router.get('/po/sub/:subteam', purchaseOrderController.getBySubteam);
router.get('/po/user/:email', purchaseOrderController.getByUser);

module.exports = router;