const { model } = require("mongoose");
const { APPOINTMENT } = require("../../constants/models-names");
const appointmentSchema = require("./schemas/appointment");

require("./hooks")(appointmentSchema);

module.exports = model(APPOINTMENT, appointmentSchema);
