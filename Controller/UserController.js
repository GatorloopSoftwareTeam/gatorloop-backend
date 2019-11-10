const userDAO = require("../DAO/UserDAO");
const net = require("../Util/Net");

//todo move basic authentication check to a separate function, keep role checks in controller functions

exports.getAll = (req, res) => {
    console.log("API GET request called for all users");

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    if (req.user.role === "admin") {
        userDAO.getAllUsers().then(function (users) {
            res.json(net.getSuccessResponse(null, users));
        }).catch(function (err) {
            console.log("error getting all users: ", err);
            res.status(500).json(net.getErrorResponse("error retrieving records from database"));
        });
    } else {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; must be admin"));
    }
};

exports.get = (req, res) => {
    console.log(`API GET request called for ${req.params.email}`);

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    if (req.params.email === req.user.email || req.user.role === "admin") {
        userDAO.getUser(req.params.email).then(function (user) {
            if (user) {
                console.log(`Successfully retrieved ${req.params.email} from the database`);
                res.json(net.getSuccessResponse(null, user));
            } else {
                console.log(`Failed to retrieve ${req.params.email} from database; User does not exist`);
                res.status(404).json(net.getErrorResponse(`User with email ${req.params.email} not found`));
            }
        }).catch(function (err) {
            console.log("error getting user: ", err);
            res.status(500).json(net.getErrorResponse("error retrieving record from database"));
        });
    } else {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; must be your account or must be admin"));
    }
};

//necessary?
exports.create = (req, res) => {
    console.log(`API POST request called for "create user"`);

    const params = req.body;

    //assume parameters have been sanitized on client side

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    if (req.user.role === "admin") {
        if (Object.keys(params).length === 3) {
            userDAO.createUser(params["name"], params["email"], params["password"]).then(function (newUser) {
                console.log("New User Created!", newUser);
                res.json(net.getSuccessResponse(null, newUser));
            }).catch(function (err) {
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
    }
};

exports.update = (req, res) => {
    console.log(`API PUT request called for ${req.params.email}`);

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    const params = req.body;

    //assume parameters have been sanitized on client side

    if (req.params.email === req.user.email || req.user.role === "admin") {
        if (Object.keys(params).length === 3) {
            userDAO.updateUser(req.params.email, params["name"], params["email"], params["password"]).then(function (updatedUser) {
                console.log("User " + updatedUser.email + " Updated!", updatedUser);
                res.json(net.getSuccessResponse("updated"));
            }).catch(function (err) {
                console.log("failed to update record");
                if (err.name === "ValidationError") {
                    console.error("Error Validating!", err);
                    res.status(422).json(net.getErrorResponse(err));
                } else {
                    console.error(err);
                    res.status(500).json(net.getErrorResponse("failed to update record"));
                }
            });
        } else {
            res.status(404).json(net.getErrorResponse("Insufficient parameters provided"));
        }
    } else {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; must be your account or must be admin"));
    }
};

exports.delete = (req, res) => {
    console.log(`API DELETE request called for ${req.params.email}`);

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    if (req.params.email === req.user.email || req.user.role === "admin") {
        userDAO.deleteUser(req.params.email).then(function (result) {
            if (result.deletedCount === 0) {
                //fail
                res.status(404).json(net.getErrorResponse("could not find record to remove for email: " + req.params.email));
            } else if (result.deletedCount === 1) {
                //success
                res.json(net.getSuccessResponse("successfully removed record", req.params.email));
            } else {
                //critical error
                res.status(500).json(net.getErrorResponse("critical server error"));
            }
        }).catch(function (err) {
            console.log("failed to remove record: ", err);
            res.status(500).json(net.getErrorResponse("failed to remove record from database"));
        })
    } else {
        res.status(401).json(net.getResponse(true , "you are not authorized to make this request; must be your account or must be admin"));
    }
};

//used for easy comparison in promote method
//greater number means greater access
const permission_levels = {
    admin: 10,
    manager: 5,
    user: 1
};

exports.promote = (req, res) => {
    console.log(`API GET request called to promote ${req.params.email}`);

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; please login"));
        return;
    }

    //todo: only admin can demote

    if (permission_levels[req.params.role] > permission_levels[req.user.role]) {
        res.status(401).json(net.getErrorResponse("you are not authorized to make this request; must cannot promote to that level"));
        return;
    }

    userDAO.promoteUser(req.params.email, req.params.role).then(function (updatedUser) {
        console.log("User " + updatedUser.email + " Promoted!", updatedUser);
        res.json(net.getSuccessResponse("user promoted successfully"));
    }).catch(function (err) {
        console.log("failed to update record");
        if (err.name === "ValidationError") {
            console.error("Error Validating!", err);
            res.status(422).json(net.getErrorResponse(err));
        } else {
            console.error(err);
            res.status(500).json(net.getErrorResponse(err, "failed to update record"));
        }
    });

};
