exports.getResponse = (fail, msg, data = "") => {
    if (fail) {
        return {success: !fail, error: msg};
    } else {
        return {success: fail, message: msg, data: data};
    }
};

exports.getErrorResponse = (error) => {
    return {success: false, error: error};
};

exports.getSuccessResponse = (message, data) => {
    if (!message) message = "";
    if (typeof data === "undefined") data = {};
    return {success: true, message: message, data: data}
};