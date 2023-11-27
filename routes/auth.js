const router = require("express").Router()
const userValidatorsSchemas = require("../validators/user")
const authController = require("../controllers/auth")
const userController = require("../controllers/user")
const { validateRequestBody } = require("../middlewares/validateRequest")
const filterBody = require("../middlewares/filterBody")
const auth = require("../middlewares/auth")
const allRoles = require("../constants/user")

router.post(
  '/register',
  validateRequestBody(userValidatorsSchemas.signUpSchema),
  authController.signUp
)

router.post(
  '/login',
  validateRequestBody(userValidatorsSchemas.loginSchema),
  authController.login
)


router.post(
  "/verify-otp",
  filterBody(["phone", "otp"]),
  validateRequestBody(userValidatorsSchemas.verifyOtpSchema),
  userController.verifyOtp
)

router.post(
  "/resend-otp",
  filterBody(["phone"]),
  validateRequestBody(userValidatorsSchemas.resendOtpSchema),
  userController.resendOtp
)


// router.post(
//   "/changePassword",
//   auth(allRoles),
//   validateRequestBody(userValidatorsSchemas.changePasswordSchema),
//   userController.changePassword
// )

router.post(
  "/forget-password",
  filterBody(["phone"]),
  validateRequestBody(userValidatorsSchemas.forgetPasswordSchema),
  userController.forgetPassword
)


// router.post(
//   '/verifyCode',
//   authController.verifyMobilecode
// );



module.exports = router