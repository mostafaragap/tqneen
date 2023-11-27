const router = require("express").Router()
const auth = require("../middlewares/auth")
const fileController = require("../controllers/image")
const allRoles = require("../constants/user")
// const { configureMulter } = require("../utils/multer");
const imageValidators = require("../validators/image")
const { validateRequestParams } = require("../middlewares/validateRequest");
const upload = require('../utils/multer');
// Configure Multer for file upload
// const upload = configureMulter();

router.post(
    "/",
    upload,
    fileController.uploadFile
)

router.get(
    "/:key",
    validateRequestParams(imageValidators.getBykey),
    fileController.get
)


router.delete(
    "/:key",
    validateRequestParams(imageValidators.getBykey),
    fileController.remove
)


module.exports = router