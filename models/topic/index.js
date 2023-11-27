const { model } = require("mongoose");
const { TOPIC } = require("../../constants/models-names");
const topicSchema = require("./schemas/topic");

module.exports = model(TOPIC, topicSchema);
