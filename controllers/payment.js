const appointmentService = require("../services/appointment")
const userService = require("../services/user")
const paymentService = require("../services/payment")
const { CustomError } = require("../utils/error")
const { paymentError, appointmentError } = require("../constants/errorMessages")
const { BAD_REQUEST } = require("../constants/status-codes")

const createPaymentLink = async (req, res, next) => {
    try {
        const locale = req.headers['locale']
        const userId = req.id
        const { appointmentId } = req.body
        const user = await userService.getById(+userId)
        const appointment = await appointmentService.getById(+appointmentId, userId)
        if (!user || !appointment) throw new CustomError(paymentError[locale], BAD_REQUEST)
        if (appointment.status !== "accepted") throw new CustomError(appointmentError[locale], BAD_REQUEST)
        const paymentLink = await paymentService.createPaymentLink(user, appointment, locale, res)
        // return res.send({paymentLink})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createPaymentLink
} 