const User = require("../Model/User.js").Model;

exports.createUser = (
    name_,
    email_,
    password_
) => {
    const newUser = new User({
        name: name_,
        email: email_,
        password: password_
    });
    return newUser.save();
};

exports.getAllUsers = callback => {
  return User.find({}).exec();
};

//get user by email
exports.getUser = (email_, callback) => {
  return User.findOne({ email: email_ });
};

/*
exports.updateUser = (email_, name_, new_email_, password_, callback) => {
    User.findOne({ email: email_ }, function (error, user) {
        if (error) {
            throw error;
        }

        user.name = name_;
        user.password = password_;

        user.save(function (updatedUser) {
            console.log(`Successfully updated ${email_} in the database`);
        });
    });
    })
};
*/

exports.updateUser = (email_, name_, new_email_, password_) => {
    return new Promise (function (resolve, reject) {
        User.findOne({ email: email_ }).exec().then(function (user) {
            user.name = name_;
            user.password = password_;
            user.email = new_email_;
            resolve(user.save());
        }).catch(function (err){
          reject(err);
        });
    })
};
