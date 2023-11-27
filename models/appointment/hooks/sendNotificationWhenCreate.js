const { sendFcmNotification } = require("../../../utils/sendFcmNotification");
const userService = require("../../../services/user")

module.exports = function (appointmentSchema) {
    appointmentSchema.post('save', async function (doc, next) {

        const customer = doc.customer
        const lawyer = doc.lawyer
        const getCustomer = await userService.getById(customer)
        const getlawyer = await userService.getById(lawyer)

        if (getCustomer.firebaseToken != null) {
            const notification = {
                title: `Appointment created Successfully`,
                body: `your appointment number #${doc.id} are sent successfully to Mr.${getlawyer.full_name}`
            }
            const data = { id: doc.id, status: "request" }
            let sendNotification = await sendFcmNotification(getCustomer.firebaseToken, notification, data)
        }

        if (getlawyer.firebaseToken != null) {
            const notification = {
                title: `Appointment Request`,
                body: `customer ${getCustomer.full_name} sent to you an appointment request number: #${doc.id}`
            }
            const data = { id: doc.id, status: "request" }
            let sendNotification = await sendFcmNotification(getlawyer.firebaseToken, notification, data)
        }
        next();


    });

};