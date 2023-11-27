const router = require("express").Router()
const auth = require("../middlewares/auth")
const docRequestController = require("../controllers/docRequest")

const allRoles = require("../constants/user")
const docRequestValidator = require("../validators/docRequest")
const { validateRequestParams, validateRequestBody } = require("../middlewares/validateRequest")


router.get(
    "/",
    auth(["lawyer"]),
    docRequestController.getAll
)

router.post(
    "/",
    auth(["lawyer"]),
    validateRequestBody(docRequestValidator.create),
    docRequestController.create
)


module.exports = router