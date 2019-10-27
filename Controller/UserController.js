const userDAO = require("../DAO/UserDAO");

exports.getAll = (req, res) => {
    console.log("API GET request called for all users");
    userDAO.getAllUsers(result => {
        res.send(result);
    });
};

exports.get = (req, res) => {
    console.log(`API GET request called for ${req.params.email}`);
    userDAO.getUser(req.params.email, result => {
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({error: `User with email ${req.params.email} not found`});
        }
    });
};

exports.create = (req, res) => {
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
