const express = require('express');

let router = express.Router();

router.get('/',
    function(req, res) {
        res.redirect('/home');
    });

router.get('/home',
    function(req, res) {
        res.render('home', { user: req.user });
    });

router.get('/profile',
    require('connect-ensure-login').ensureLoggedIn('/auth/login'),
    function(req, res){
        res.render('profile', { user: req.user });
    });

module.exports = router;