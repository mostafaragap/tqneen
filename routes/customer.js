const router = require("express").Router()
const auth = require("../middlewares/auth")
const customerController = require("../controllers/customer")
const appointmentController = require("../controllers/appointment")
const allRoles = require("../constants/user")
const idValidator = require("../validators/city")
const { validateRequestParams } = require("../middlewares/validateRequest")


router.get(
    "/lawyers",
    auth(["customer"]),
    customerController.getActiveLawyers
)

router.get(
    "/lawyers/:id",
    auth([...allRoles, "admin"]),
    validateRequestParams(idValidator.getById),
    customerController.getSingleLawyer
)

router.get(
    "/home",
    auth(["customer"]),
    customerController.getHomePage
)



router.post(
    "/appointment",
    auth(["customer"]),
    appointmentController.create
)


module.exports = router