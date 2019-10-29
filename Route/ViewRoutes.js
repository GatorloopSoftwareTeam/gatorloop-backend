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
    require('connect-ensure-login').ensureLoggedIn('/login'),
    function(req, res){
        res.render('profile', { user: req.user });
    });

router.get('/login',
    function(req, res){
        res.render('login');
    });

router.get('/signup',
    function(req, res){
        if (req.user) {
            res.redirect('/home');
        } else {
            res.render('signup');
        }
    });

//default for /*
router.get('*', function (req, res) {
    res.status(404).send("page not found");
});

module.exports = router;