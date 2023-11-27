const { model } = require("mongoose");
const autoIncremantSchema = require("./schemas/autiIncrement");

module.exports = model('autoIncremant', autoIncremantSchema);
