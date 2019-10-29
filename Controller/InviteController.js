const inviteDAO = require('../DAO/InviteDAO');

exports.getAll = (req, res) => {
    console.log("API GET request called for all invites");

    inviteDAO.getAllInvites().then(function (pos) {
        res.send(pos);
    }).catch(function (err) {
        console.log("error getting all invites: ", err);
        res.status(500).json({error: 'error retrieving records from database'});
    });
};
