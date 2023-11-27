const { model } = require("mongoose");
const { CITY } = require("../../constants/models-names");
const citySchema = require("./schemas/city");

module.exports = model(CITY, citySchema);
