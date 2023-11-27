const AWS = require('aws-sdk');

const stream = require('stream');
const Image = require("../models/image");
const { CustomError } = require('../utils/error');
const { imageEror, deleteImageError } = require('../constants/errorMessages');
const { BAD_REQUEST } = require('../constants/status-codes');


AWS.config.update({
  accessKeyId: 'AKIAVDQB3K5C4DE7T56S',
  secretAccessKey: 'woLpmIMnBIwfgFbvfRf5pYMVZXAyknXgK9IAzYeo',
  //   region: 'your_aws_region',
});

const s3 = new AWS.S3();

async function getDocFromS3AndSendAsStream(objectKey, response, locale) {
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
  response.setHeader('Content-Type', 'file/*'); // Adjust the content type based on your image type
  response.setHeader('Content-Length', s3Object.ContentLength);
  response.setHeader('Content-Disposition', `inline; filename="${objectKey}"`);

  // Pipe the image stream to the HTTP response
  imageStream.pipe(response);
}

module.exports = { getDocFromS3AndSendAsStream }