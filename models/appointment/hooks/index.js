module.exports = function (appointmentSchema) {
  require("./sendNotificationWhenUpdate")(appointmentSchema);
  require("./sendNotificationWhenCreate")(appointmentSchema);
  require("./sendNotificationWhenPay")(appointmentSchema);
};
