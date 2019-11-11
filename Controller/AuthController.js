const userDAO = require("../DAO/UserDAO");
const net = require("../Util/Net");

const passport = require("passport");

exports.signup = (req, res) => {
    console.log("API POST request called for /auth/signup");

    const params = req.body;

    //assume parameters sanitized on client

    if (Object.keys(params).length === 3) {
        userDAO.createUser(params["name"], params["username"], params["password"]).then(function (newUser) {
            console.log("new user created", newUser);
            res.json(net.getSuccessResponse("new user created", newUser));
        }).catch(function(err) {
            if (err.name === "ValidationError") {
                console.error("Error Validating!", err);
                res.status(422).json(net.getErrorResponse(err));
            } else {
                console.error(err);
                res.status(500).json(net.getErrorResponse(err));
            }
        });
    } else {
        res.status(404).json(net.getErrorResponse("Insufficient parameters provided"));
    }

    //todo
    //inviteDAO.confirmInvite(params.invite_code, params.email);
    //const passHash = hash(params.password)
    //userDAO.createUser(params.name, params.email, passHash)
};

exports.login = (req, res) => {
    console.log("API POST request called for /auth/login");

    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/login",
        failureFlash: true
    });
};

exports.logout = (req, res) => {
    console.log("API GET request called for /auth/logout");

    //only one necessary?
    req.session.destroy();
    req.logout();
    res.redirect("/home");
};