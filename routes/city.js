const router = require("express").Router()
const { validateRequestBody, validateRequestParams, validateRequestQuery } = require("../middlewares/validateRequest")
const auth = require("../middlewares/auth")
const cityController = require("../controllers/city")
const cityValidatorsSchemas = require("../validators/city")
const allRoles = require("../constants/user")
const filter = require("../middlewares/filterBody")

router.get(
    "/",
    cityController.getAll
)

router.get(
    "/:id",
    auth(allRoles),
    validateRequestParams(cityValidatorsSchemas.getById),
    cityController.getSingle
)

//admin
router.post(
    "/",
    auth(["admin"]),
    filter(["name"]),
    validateRequestBody(cityValidatorsSchemas.addCitySchema),
    cityController.create
)

router.put(
    "/:id",
    auth(["admin"]),
    filter(["name", "is_active"]),
    validateRequestParams(cityValidatorsSchemas.getById),
    validateRequestBody(cityValidatorsSchemas.updateCitySchema),
    cityController.update
)





module.exports = router