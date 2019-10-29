const express = require('express');
const passport = require('passport');

const authController = require('../Controller/AuthController');

let router = express.Router();

router.post('/signup', authController.signup);

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

router.get('/logout', authController.logout);

//default for /auth/*
router.get('*', function (req, res) {
    res.redirect('/login');
});

module.exports = router;