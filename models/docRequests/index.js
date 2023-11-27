const { model } = require("mongoose");
const { DOCReq } = require("../../constants/models-names");
const docReqSchema = require("./schemas/docRequest");

require("./hooks")(docReqSchema);

module.exports = model(DOCReq, docReqSchema);
