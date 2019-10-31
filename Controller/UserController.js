const userDAO = require("../DAO/UserDAO");

exports.getAll = (req, res) => {
    console.log("API GET request called for all users");

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json({error: "you are not authorized to make this request; please login"});
        return;
    }

    if (req.user.role === "admin") {
        userDAO.getAllUsers().then(function (users) {
            res.send(users);
        }).catch(function (err) {
            console.log("error getting all users: ", err);
            res.status(500).json({error: 'error retrieving records from database'});
        });
    } else {
        res.status(401).json({error: "you are not authorized to make this request; must be admin"});
    }
};

exports.get = (req, res) => {
    console.log(`API GET request called for ${req.params.email}`);

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json({error: "you are not authorized to make this request; please login"});
        return;
    }

    if (req.params.email === req.user.email || req.user.role === "admin") {
        userDAO.getUser(req.params.email).then(function (user) {
            if (user) {
                console.log(`Successfully retrieved ${req.params.email} from the database`);
                res.json(user);
            } else {
                console.log(`Failed to retrieve ${req.params.email} from database; User does not exist`);
                res.status(404).json({error: `User with email ${req.params.email} not found`});
            }
        }).catch(function (err) {
            console.log("error getting user: ", err);
            res.status(500).json({error: 'error retrieving record from database'});
        });
    } else {
        res.status(401).json({error: "you are not authorized to make this request; must be your account or must be admin"});
    }
};

exports.create = (req, res) => {
    console.log(`API POST request called for 'create user'`);

    const params = req.body;

    //todo: invite code logic for permission (no session needed)

    //assume parameters have been sanitized on client side

    if (Object.keys(params).length === 3) {
        userDAO.createUser(params["name"], params["email"], params["password"]).then(function(newUser) {
            console.log('New User Created!', newUser);
            res.json(newUser);
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
};

exports.update = (req, res) => {
    console.log(`API PUT request called for ${req.params.email}`);

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json({error: "you are not authorized to make this request; please login"});
        return;
    }

    const params = req.body;

    //assume parameters have been sanitized on client side

    if (req.params.email === req.user.email || req.user.role === "admin") {
        if (Object.keys(params).length === 3) {
            userDAO.updateUser(req.params.email, params["name"], params["email"], params["password"]).then(function (updatedUser) {
                console.log('User ' + updatedUser.email + ' Updated!', updatedUser);
                res.json({message: "success"});
            }).catch(function (err) {
                console.log("failed to update record");
                if (err.name === 'ValidationError') {
                    console.error('Error Validating!', err);
                    res.status(422).json(err);
                } else {
                    console.error(err);
                    res.status(500).json({error: "failed to update record"});
                }
            });
        } else {
            res.status(404).send("Insufficient parameters provided");
        }
    } else {
        res.status(401).json({error: "you are not authorized to make this request; must be your account or must be admin"});
    }
};

exports.delete = (req, res) => {
    console.log(`API DELETE request called for ${req.params.email}`);

    if (!req.user || !req.isAuthenticated()) {
        res.status(401).json({error: "you are not authorized to make this request; please login"});
        return;
    }

    if (req.params.email === req.user.email || req.user.role === "admin") {
        userDAO.deleteUser(req.params.email).then(function (result) {
            if (result.deletedCount === 0) {
                //success
                res.status(404).json({error: "could not find record to remove for email: " + req.params.email});
            } else if (result.deletedCount === 1) {
                //success
                res.json({message: "successfully removed record", email: req.params.email})
            } else {
                //critical error
                res.status(500).json({error: "critical server error"});
            }
        }).catch(function (err) {
            console.log("failed to remove record: ", err);
            res.status(500).json({error: "failed to remove record from database"});
        })
    } else {
        res.status(401).json({error: "you are not authorized to make this request; must be your account or must be admin"});
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
        res.status(401).json({error: "you are not authorized to make this request; please login"});
        return;
    }

    if (permission_levels[req.params.role] > permission_levels[req.user.role]) {
        res.status(401).json({error: "you are not authorized to make this request; must cannot promote to that level"});
        return;
    }

    userDAO.promoteUser(req.params.email, req.params.role).then(function (updatedUser) {
        console.log('User ' + updatedUser.email + ' Promoted!', updatedUser);
        res.json({message: "success"});
    }).catch(function (err) {
        console.log("failed to update record");
        if (err.name === 'ValidationError') {
            console.error('Error Validating!', err);
            res.status(422).json(err);
        } else {
            console.error(err);
            res.status(500).json({error: "failed to update record"});
        }
    });

};
