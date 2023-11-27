module.exports = function (docReqSchema) {
  require("./sendNotificationWhenUpdate")(docReqSchema);
};
