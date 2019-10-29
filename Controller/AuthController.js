const inviteDAO = require('../DAO/InviteDAO');
const userDAO = require('../DAO/UserDAO');

const passport = require('passport');

exports.signup = (req, res) => {
    console.log("API POST request called for /auth/signup");

    const params = req.body;

    //todo
    //inviteDAO.confirmInvite(params.invite_code, params.email);
    //const passHash = hash(params.password)
    //userDAO.createUser(params.name, params.email, passHash)
};

exports.login = (req, res) => {
    console.log("API POST request called for /auth/login");

    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    });
};

exports.logout = (req, res) => {
    console.log("API GET request called for /auth/logout");

    req.session.destroy();
    req.logout();
    res.redirect('/home');
};