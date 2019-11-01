const Invite = require("../Model/Invite.js").Model;

exports.getAllInvites = () => {
    return Invite.find({}).exec();
};

exports.confirmInvite = (code, email) => {
    //todo
};
