const mongoose = require("mongoose");
const { IMAGE } = require("../../constants/models-names");

const imageSchema = require("./schemas/image");

// require("./hooks")(imageSchema);
// require("./statics")(imageSchema);
// require("./methods")(imageSchema);

module.exports = mongoose.model(IMAGE, imageSchema);
