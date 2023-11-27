const multer = require("multer");
let path = require("path");
const { CustomError } = require("./error");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Set the destination directory for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const allowedFileTypes = /\.(pdf|doc|txt)$/; // Add or modify file extensions as needed

const fileFilter = function (req, file, cb) {
    if (!file.originalname.match(allowedFileTypes)) {
        return cb(new CustomError('Only PDF, DOC, and TXT files are allowed!', 400), false);
    }
    cb(null, true);
}

// Initialize multer with the storage configuration
let upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter
});


module.exports = multer(upload).single("file");