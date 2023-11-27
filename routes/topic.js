const router = require("express").Router()
const { validateRequestBody, validateRequestParams, validateRequestQuery } = require("../middlewares/validateRequest")
const auth = require("../middlewares/auth")
const topicController = require("../controllers/topic")
const topicValidatorsSchemas = require("../validators/topic")
const allRoles = require("../constants/user")
const filter = require("../middlewares/filterBody")

router.get(
    "/",
    topicController.getAll
)

router.get(
    "/:id",
    validateRequestParams(topicValidatorsSchemas.getById),
    topicController.getSingle
)

//admin
router.post(
    "/",
    auth(["admin"]),
    validateRequestBody(topicValidatorsSchemas.addTopicSchema),
    topicController.create
)

router.put(
    "/:id",
    auth(["admin"]),
    filter(["name", "is_active"]),
    validateRequestParams(topicValidatorsSchemas.getById),
    validateRequestBody(topicValidatorsSchemas.updateTopicSchema),
    topicController.update
)





module.exports = router