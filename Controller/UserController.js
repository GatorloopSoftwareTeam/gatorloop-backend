const userDAO = require("../DAO/UserDAO");

exports.getAll = (req, res) => {
    console.log("API GET request called for all users");
    userDAO.getAllUsers(result => {
        res.send(result);
    });
};

exports.get = (req, res) => {
    console.log(`API GET request called for ${req.params.id}`);
    userDAO.getUser(req.params.id, result => {
        if (result) {
            res.json(result);
        } else {
            res.status(404).send(`User with email ${req.params.id} not found`);
        }
    });
};

exports.create = (req, res) => {
    const params = req.query;

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
