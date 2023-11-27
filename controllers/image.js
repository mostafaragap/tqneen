
const { deleteImageOk } = require("../constants/errorMessages");
const { uploadImage, getImageFromS3AndSendAsStream, deleteImage } = require("../services/image");

const uploadFile = async (req, res, next) => {
  try {
    const path = req.file.path;
    const uploadedFile = await uploadImage(path, `${Date.now()}.webp`)

    return res.send({ url: `${process.env.IMAGE_URL}/${uploadedFile}` })
  } catch (error) {
    console.log({ error });
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    let { key } = req.params
    const locale = req.headers['locale']

    getImageFromS3AndSendAsStream(key, res, locale)
      .catch((error) => {
        next(error)
      });
  } catch (error) {
    next(error)
  }

}


const remove = async (req, res, next) => {
  try {
    const { key } = req.params
    const locale = req.headers['locale']

    let removeImage = await deleteImage(key, locale)
    return res.send({ message: deleteImageOk[locale] })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  uploadFile,
  get,
  remove
};
