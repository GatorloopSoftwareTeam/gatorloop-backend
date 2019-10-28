const express = require('express');

const userController = require('../Controller/UserController');

let router = express.Router();

router.get('/user', userController.getAll);
router.get('/user/:email', userController.get);
router.put('/user/:email', userController.update);
router.post('/user', userController.create);
router.delete('/user/:email', userController.delete);
//router.get('/user/:email/promote', userController.promote);

module.exports = router;