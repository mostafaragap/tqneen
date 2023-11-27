
const { deleteImageOk } = require("../constants/errorMessages");
const { getDocFromS3AndSendAsStream } = require("../services/file");
const { uploadImage, getImageFromS3AndSendAsStream, deleteImage } = require("../services/image");

const uploadFile = async (req, res, next) => {
  try {
    const path = req.file.path;
    let fullFileName = `${Date.now()}.${req.file.originalname.split(".")[1]}`

    const uploadedFile = await uploadImage(path, fullFileName)

    return res.send({ url: `${process.env.FILE_URL}/${uploadedFile}` })
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    let { key } = req.params
    const locale = req.headers['locale']

    getDocFromS3AndSendAsStream(key, res, locale)
      .catch((error) => {
        next(error)
      });
  } catch (error) {
    next(error)
  }

}
module.exports = {
  uploadFile,
  get,
  // remove
};
