const express = require('express');
const passport = require('passport');

let router = express.Router();

router.get('/login',
    function(req, res){
        res.render('login');
    });

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/auth/login',
        failureFlash: true
    })
);

router.get('/logout',
    function(req, res){
        req.session.destroy();
        req.logout();
        res.redirect('/home');
    });

module.exports = router;