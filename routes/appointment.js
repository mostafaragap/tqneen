const router = require("express").Router()
const { validateRequestBody, validateRequestParams, validateRequestQuery } = require("../middlewares/validateRequest")
const auth = require("../middlewares/auth")
const appointmentController = require("../controllers/appointment")
const appointmentValidator = require("../validators/appointment")
const allRoles = require("../constants/user")
const filter = require("../middlewares/filterBody")

router.post(
    "/",
    auth(["customer"]),
    // filter([""])
    validateRequestBody(appointmentValidator.createAppointment),
    appointmentController.create
)

router.put(
    "/:id",
    auth([...allRoles, "admin"]),
    // filter([""])
    validateRequestParams(appointmentValidator.getByid),
    validateRequestBody(appointmentValidator.updateAppointment),
    appointmentController.update
)

router.get(
    "/:id",
    auth([...allRoles, "admin"]),
    // filter([""])
    validateRequestParams(appointmentValidator.getByid),
    appointmentController.getByid
)

router.get(
    "/",
    auth([...allRoles, "admin"]),
    // filter([""])
    appointmentController.getAll
)

module.exports = router