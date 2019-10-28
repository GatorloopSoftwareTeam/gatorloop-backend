const express = require('express');
const passport = require('passport');

let router = express.Router();

router.get('/',
    function(req, res) {
        res.render('home', { user: req.user });
    });

router.get('/login',
    function(req, res){
        res.render('login');
    });

router.get('/profile',
    require('connect-ensure-login').ensureLoggedIn('/auth/login'),
    function(req, res){
        res.render('profile', { user: req.user });
    });


router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/auth/profile',
        failureRedirect: '/auth/login',
        failureFlash: true
    })
);

router.get('/logout',
    function(req, res){
        req.session.destroy();
        req.logout();
        res.redirect('/auth');
    });

module.exports = router;