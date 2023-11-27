const { model } = require("mongoose");
const { AREA } = require("../../constants/models-names");
const areaSchema = require("./schemas/area");

module.exports = model(AREA, areaSchema);
