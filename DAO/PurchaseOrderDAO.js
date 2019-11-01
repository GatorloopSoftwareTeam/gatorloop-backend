const PurchaseOrder = require("../Model/PurchaseOrder.js").Model;

exports.getAllPurchaseOrders = () => {
    return PurchaseOrder.find({}).exec();
};

//todo: add subteam
exports.createPurchaseOrder = (
    po_number_,
    owner_,
    description_,
    file_location_
) => {
    const newPO = new PurchaseOrder({
        po_number: po_number_,
        owner: owner_,
        description: description_,
        file_location: file_location_
    });
    return newPO.save();
};

//get po by number
exports.getPO = (po_number_) => {
    return PurchaseOrder.findOne({ po_number: po_number_ });
};

//todo: add subteam
exports.updatePO = (po_number_, new_po_number_, new_owner_, new_description_, new_file_location_) => {
    return new Promise (function (resolve, reject) {
        PurchaseOrder.findOne({ po_number: po_number_ }).exec().then(function (po) {
            po.po_number = new_po_number_;
            po.owner = new_owner_;
            po.description = new_description_;
            po.file_location = new_file_location_;
            resolve(po.save());
        }).catch(function (err){
            reject(err);
        });
    });
};

exports.deletePO = (po_number_) => {
    return PurchaseOrder.remove({po_number: po_number_}, {single: true}).exec();
};

exports.getBySubteam = (subteam_) => {
    return PurchaseOrder.find({subteam: subteam_}).exec();
};

exports.getByUser = (email_) => {
    return PurchaseOrder.find({owner: email_}).exec();
};
