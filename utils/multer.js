// // Configure Multer for file upload
// const multer = require('multer');
// // Configure Multer for file upload
// const uploadDirectory = 'uploads';
// const fs = require('fs');
// const path = require('path');

// // Create the "uploads" directory if it doesn't exist
// if (!fs.existsSync(uploadDirectory)) {
//   fs.mkdirSync(uploadDirectory);
// }

// // Function to configure Multer for file upload
// function configureMulter() {
//   const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//       callback(null, uploadDirectory);
//     },
//     filename: (req, file, callback) => {
//       callback(null, file.originalname);
//     },
//   });

//   return multer({ storage });
// }

// module.exports = {
//     configureMulter
// }
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

const imageFilter = function (req, file, cb) {
  // Check if the file is an image
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new CustomError('Only image files are allowed!', 400), false);
  }
  cb(null, true);
};

// Initialize multer with the storage configuration
let upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: imageFilter
});


module.exports = multer(upload).single("image");