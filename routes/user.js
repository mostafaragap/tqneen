const router = require("express").Router()
const { validateRequestBody, validateRequestParams, validateRequestQuery } = require("../middlewares/validateRequest")
const auth = require("../middlewares/auth")
const userController = require("../controllers/user")
const userValidatorsSchemas = require("../validators/user")
const allRoles = require("../constants/user")
const filter = require("../middlewares/filterBody")
const { nocache } = require("../middlewares/nocache");

router.get(
    "/profile",
    auth(allRoles),
    userController.getProfile
)

router.post(
    "/rtctoken",
    auth(["customer"]),
    validateRequestBody(userValidatorsSchemas.gatRtc),
    nocache,
    userController.genRTCToken
);

router.post(
    "/freeCount",
    auth(["customer"]),
    userController.decreaseNumOfFree
)
//admin
router.post(
    "/",
    auth(["admin"]),
    validateRequestBody(userValidatorsSchemas.signUpSchema),
    userController.createUser
)

router.put(
    "/",
    auth([...allRoles, "admin"]),
    validateRequestBody(userValidatorsSchemas.updateProfile),
    userController.updateProfile
)

router.put(
    "/completeProfile",
    auth(["lawyer"]),
    validateRequestBody(userValidatorsSchemas.completeProfile),
    userController.completeProfile
)




module.exports = router