const router = require("express").Router()
const adminValidatorsSchemas = require("../validators/admin")
const userValidatorsSchemas = require("../validators/user")

const auth = require("../middlewares/auth")

const adminController = require("../controllers/admin")
const userController = require("../controllers/user")
const { validateRequestBody, validateRequestParams } = require("../middlewares/validateRequest")
const docRequestController = require("../controllers/docRequest")
const docRequestValidator = require("../validators/docRequest")

// auth
router.post(
  '/login',
  validateRequestBody(adminValidatorsSchemas.loginSchema),
  adminController.login
)


//users
router.get(
  "/users",
  auth(["admin"]),
  userController.getAllUsers
)


router.put(
  "/users/:userId",
  auth(["admin"]),
  validateRequestBody(userValidatorsSchemas.updateProfile),
  userController.updateUserByadmin
)

//lawyers
router.post(
  "/users",
  auth(["admin"]),
  validateRequestBody(userValidatorsSchemas.createUserBuAdmin),
  userController.createUser
)

// document requests

router.get(
  "/docRequest",
  auth(["admin"]),
  docRequestController.getAll
)

router.put(
  "/docRequest/:id",
  auth(["admin"]),
  validateRequestParams(docRequestValidator.getById),
  validateRequestBody(docRequestValidator.update),
  docRequestController.update
)






module.exports = router