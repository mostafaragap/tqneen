const router = require("express").Router()
const auth = require("../middlewares/auth")
const fileController = require("../controllers/file")
const allRoles = require("../constants/user")
const imageValidators = require("../validators/image")
// const { configureMulter } = require("../utils/multer");
// Configure Multer for file upload
const upload = require('../utils/multerFile');
const { validateRequestParams } = require("../middlewares/validateRequest");

router.post(
    "/",
    auth(allRoles),
    upload,
    fileController.uploadFile
)

router.get(
    "/:key",
    validateRequestParams(imageValidators.getBykey),
    fileController.get
)


module.exports = router