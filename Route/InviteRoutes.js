const express = require('express');

const inviteController = require('../Controller/InviteController');

let router = express.Router();

//core
//router.get('/invite', inviteController.getAll);
//router.get('/invite/:email', inviteController.get);
//router.put('/invite/:email', inviteController.update);
//router.post('/invite', inviteController.create);
//router.delete('/invite/:email', inviteController.delete);

module.exports = router;