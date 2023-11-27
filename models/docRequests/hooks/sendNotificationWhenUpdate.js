const { sendFcmNotification } = require("../../../utils/sendFcmNotification");
const userService = require("../../../services/user")

module.exports = function (docReqSchema) {
    docReqSchema.post('findOneAndUpdate', async function (doc, next) {
        // console.log(this);
        const updatedFields = this.getUpdate()
        let checkStatus = updatedFields['$set']['status']
        if (checkStatus != null && (checkStatus == "accepted" || checkStatus == "rejected")) {
            const customer = doc.customer
            const lawyer = doc.lawyer
            const getlawyer = await userService.getById(lawyer)

            if (getlawyer.firebaseToken !== "") {
                const notification = {
                    title: `Document ${checkStatus}`,
                    body: `Your document request has been ${checkStatus} by admin`
                }
                const data = { id: doc.id, status: checkStatus }
                let sendNotification = await sendFcmNotification(getlawyer.firebaseToken, notification, data)
                next();
            }
            next();
        }
        next();
    });
};