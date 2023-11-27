const { sendFcmNotification } = require("../../../utils/sendFcmNotification");
const userService = require("../../../services/user")

module.exports = function (appointmentSchema) {
    appointmentSchema.post('findOneAndUpdate', async function (doc, next) {
        // console.log(this);
        const updatedFields = this.getUpdate()
        let checkStatus = updatedFields['$set']['status']
        console.log({ checkStatus });
        if (checkStatus != null && checkStatus == "completed") {
            console.log("completed");
            const customer = doc.customer
            const lawyer = doc.lawyer
            const getCustomer = await userService.getById(customer)
            const getlawyer = await userService.getById(lawyer)
            if (getCustomer.firebaseToken !== "") {
                const notification = {
                    title: `Successfull paid`,
                    body: `You paid ${doc.fees}EP for your appointment number: #${doc.id} successfully`
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