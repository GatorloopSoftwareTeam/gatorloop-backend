const inviteDAO = require('../DAO/InviteDAO');
const userDAO = require('../DAO/UserDAO');

const passport = require('passport');

exports.signup = (req, res) => {
    console.log("API POST request called for /auth/signup");

    const params = req.body;
    console.log(params);

    if (Object.keys(params).length === 4) {
        userDAO.createUser(params["name"], params["username"], params["password"]).then(function (newUser) {
            console.log('New User Created!', newUser);
            //res.json(newUser);
            //res.json({success: true, message: "New User Created"});
            res.redirect(200, '/home');
        }).catch(function(err) {
            if (err.name === 'ValidationError') {
                console.error('Error Validating!', err);
                res.status(422).json(err);
            } else {
                console.error(err);
                res.status(500).json(err);
            }
        });
    } else {
        res.status(404).send("Insufficient parameters provided");
    }

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

    //only one necessary?
    req.session.destroy();
    req.logout();
    res.redirect('/home');
};