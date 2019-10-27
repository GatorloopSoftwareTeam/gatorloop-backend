const userDAO = require("../DAO/UserDAO");

exports.getAll = (req, res) => {
    console.log("API GET request called for all users");

    userDAO.getAllUsers().then(function (users) {
        res.send(users);
    }).catch(function (err) {
        console.log("error getting all users: ", err);
        res.status(500).json({error: 'error retrieving records from database'});
    });
};

exports.get = (req, res) => {
    console.log(`API GET request called for ${req.params.email}`);

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
};

exports.create = (req, res) => {
    console.log(`API POST request called for 'create user'`);

    const params = req.body;

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

    const params = req.body;

    //assume parameters have been sanitized on client side

    if (Object.keys(params).length === 3) {
        userDAO.updateUser(req.params.email, params["name"], params["email"], params["password"]).then(function(updatedUser) {
            console.log('User '+updatedUser.email+' Updated!', updatedUser);
            res.json(updatedUser);
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
};

exports.delete = (req, res) => {
    console.log(`API DELETE request called for ${req.params.email}`);

    userDAO.deleteUser(req.params.email).then(function (result) {
        if (result.deletedCount === 0) {
            //success
            res.status(404).json({error: "could not find record to remove for email: "+req.params.email});
        } else if (result.deletedCount === 1) {
            //success
            res.json({message: "successfully removed record",email: req.params.email})
        } else {
            //critical error
            res.status(500).json({error: "critical server error"});
        }
    }).catch(function (err) {
        console.log("failed to remove record: ", err);
        res.status(500).json({error: "failed to remove record from database"});
    })
};
