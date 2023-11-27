const { sendFcmNotification } = require("../../../utils/sendFcmNotification");
const userService = require("../../../services/user")

module.exports = function (appointmentSchema) {
    appointmentSchema.post('findOneAndUpdate', async function (doc, next) {
        // console.log(this);
        const updatedFields = this.getUpdate()
        let checkStatus = updatedFields['$set']['status']
        if (checkStatus != null && (checkStatus == "accepted" || checkStatus == "rejected")) {
            const customer = doc.customer
            const lawyer = doc.lawyer
            const getCustomer = await userService.getById(customer)
            const getlawyer = await userService.getById(lawyer)

            if (getCustomer.firebaseToken !== "") {
                const notification = {
                    title: `Appointment ${checkStatus}`,
                    body: `Mr.${getlawyer.full_name} ${checkStatus} your appointment number: #${doc.id}`
                }
                const data = { id: doc.id, status: checkStatus }
                let sendNotification = await sendFcmNotification(getCustomer.firebaseToken, notification, data)
                next();
            }
            next();
        }
        next();
    });

};