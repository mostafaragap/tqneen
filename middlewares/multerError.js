// const { BAD_REQUEST } = require("../../constants/status-codes");

const { BAD_REQUEST } = require("../constants/status-codes");

module.exports = (err, req, res, next) => {
    if (
        err.message === "File too large" &&
        err.code === "LIMIT_FILE_SIZE" &&
        (err.field === "file" || err.field === "image")

    ) {
        err.statusCode = BAD_REQUEST;
    }
    next(err);
};
