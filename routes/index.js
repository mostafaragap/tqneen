const router = require("express").Router()

const auth = require("./auth")
const user = require("./user")
const city = require("./city")
const area = require("./area")
const specialization = require("./specialization")
const topic = require("./topic")
const customer = require("./customer")
const appointment = require("./appointment")
const payment = require("./payment")
const image = require("./image")
const file = require("./files")
const document = require("./docRequest")


//admin
const admin = require("./admin")



router.use("/images", image)
router.use("/files", file)
router.use("/api", auth)
router.use("/api/users", user)
router.use("/api/cities", city)
router.use("/api/areas", area)
router.use("/api/topics", topic)
router.use("/api/specializations", specialization)
router.use("/api/appointments", appointment)
router.use("/api/payment", payment)
router.use("/api/document", document)

router.use("/api/customer", customer)

//admin

router.use("/api/admin", admin)

module.exports = router