const router = require("express").Router()
const auth = require("../middlewares/auth")
const paymentController = require("../controllers/payment")



router.post(
    "/",
    auth(["customer"]),
    paymentController.createPaymentLink
)


module.exports = router