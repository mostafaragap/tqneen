const router = require("express").Router()
const { validateRequestBody, validateRequestParams, validateRequestQuery } = require("../middlewares/validateRequest")
const auth = require("../middlewares/auth")
const specializationController = require("../controllers/specialization")
const specializationValidatorsSchemas = require("../validators/specialization")
const allRoles = require("../constants/user")
const filter = require("../middlewares/filterBody")

router.get(
    "/",
    specializationController.getAll
)

router.get(
    "/:id",
    validateRequestParams(specializationValidatorsSchemas.getById),
    specializationController.getSingle
)

//admin
router.post(
    "/",
    auth(["admin"]),
    validateRequestBody(specializationValidatorsSchemas.addSpecializationSchema),
    specializationController.create
)

router.put(
    "/:id",
    auth(["admin"]),
    filter(["name", "is_active"]),
    validateRequestParams(specializationValidatorsSchemas.getById),
    validateRequestBody(specializationValidatorsSchemas.updateSpecializationSchema),
    specializationController.update
)


module.exports = router