const AWS = require('aws-sdk');
const fs = require('fs');
const stream = require('stream');
const Image = require("../models/image");
const { CustomError } = require('../utils/error');
const { imageEror, deleteImageError } = require('../constants/errorMessages');
const { BAD_REQUEST } = require('../constants/status-codes');
const bucketName = "tqneen-stage"
const path = require('path')
AWS.config.update({
  accessKeyId: 'AKIAVDQB3K5C4DE7T56S',
  secretAccessKey: 'woLpmIMnBIwfgFbvfRf5pYMVZXAyknXgK9IAzYeo',
  //   region: 'your_aws_region',
});

const s3 = new AWS.S3();


function uploadImageToS3(localImagePath, objectKey) {
  // console.log({ file: });
  const fileStream = fs.readFileSync(path.resolve(__dirname, `../${localImagePath}`));

  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Body: fileStream,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.log("Error in uploadImageToS3 :  ", { err });
        reject(err);
      } else {
        resolve(data.Location); // Return the URL of the uploaded image
      }
    });
  });
}


async function getImageFromS3AndSendAsStream(objectKey, response, locale) {
  const params = {
    Bucket: 'tqneen-stage',
    Key: objectKey,
  };
  const getImage = await Image.findOne({ key: objectKey })
  if (!getImage) throw new CustomError(imageEror[locale], BAD_REQUEST)
  const s3Object = await s3.getObject(params).promise();

  // Create a readable stream from the image data
  const imageStream = new stream.PassThrough();
  imageStream.end(s3Object.Body);

  // Set the appropriate response headers
  response.setHeader('Content-Type', 'image/jpeg'); // Adjust the content type based on your image type
  response.setHeader('Content-Length', s3Object.ContentLength);
  response.setHeader('Content-Disposition', `inline; filename="${objectKey}"`);

  // Pipe the image stream to the HTTP response
  imageStream.pipe(response);
}


const uploadImage = async (imagePath, key) => {
  console.log(imagePath);
  return uploadImageToS3(imagePath, key)
    .then(async (url) => {
      const storeImageToDb = await Image.create({ key })
      console.log({ storeImageToDb });
      return key
    }).catch((error) => {
      console.log({ error });
      throw new CustomError("Error while upload" + error, 400)
    })
}


async function deleteImage(s3ObjectKey, locale) {
  const getImage = await Image.findOne({ key: s3ObjectKey })
  if (!getImage) throw new CustomError(deleteImageError[locale], BAD_REQUEST)
  return Promise.all([
    s3.deleteObject({ Bucket: bucketName, Key: s3ObjectKey }).promise(),
    Image.deleteOne({ key: s3ObjectKey }),
  ]);
}

module.exports = {
  uploadImage,
  getImageFromS3AndSendAsStream,
  deleteImage
}