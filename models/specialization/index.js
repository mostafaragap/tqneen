const { model } = require("mongoose");
const { SPECIALIZATION } = require("../../constants/models-names");
const specializationSchema = require("./schemas/specialization");


module.exports = model(SPECIALIZATION, specializationSchema);
