const inviteDAO = require("../DAO/InviteDAO");
const net = require("../Util/Net")

exports.getAll = (req, res) => {
    console.log("API GET request called for all invites");

    inviteDAO.getAllInvites().then(function (invites) {
        res.json(net.getSuccessResponse(null, invites));
    }).catch(function (err) {
        console.log("error getting all invites: ", err);
        res.status(500).json(net.getErrorResponse("error retrieving records from database"));
    });
};
