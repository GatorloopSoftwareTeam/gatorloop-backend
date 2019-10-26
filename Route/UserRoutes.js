const express = require('express');

const userController = require('../Controller/UserController');

let router = express.Router();

router.get('/user', userController.getAll);
router.get('/user/:id', userController.get);
//router.put('/user/:id', userController.update);
router.post('/user', userController.create);
//router.delete('/user/:id', userController.delete);

module.exports = router;