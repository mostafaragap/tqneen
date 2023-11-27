const router = require("express").Router()
const { validateRequestBody, validateRequestParams, validateRequestQuery } = require("../middlewares/validateRequest")
const auth = require("../middlewares/auth")
const areaController = require("../controllers/area")
const areaValidatorsSchemas = require("../validators/area")
const allRoles = require("../constants/user")
const filter = require("../middlewares/filterBody")

router.get(
    "/",
    areaController.getAll
)

router.get(
    "/:id",
    validateRequestParams(areaValidatorsSchemas.getById),
    areaController.getSingle
)

//admin
router.post(
    "/",
    auth(["admin"]),
    filter(["name", "city"]),
    validateRequestBody(areaValidatorsSchemas.addAreaSchema),
    areaController.create
)

router.put(
    "/:id",
    filter(["name", "is_active", "city"]),
    auth(["admin"]),
    validateRequestParams(areaValidatorsSchemas.getById),
    validateRequestBody(areaValidatorsSchemas.updateAreaSchema),
    areaController.update
)

module.exports = router