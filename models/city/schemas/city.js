const { Schema } = require("mongoose");
const { autoIncrement } = require("../../autoIncremant/methods/autoIncrement");
const nameSchema = require("../../general/name-schema");

const citySchema = new Schema({
  id: { type: Number },
  name: {
    type: nameSchema,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  }

});

citySchema.pre('save', autoIncrement('id'));
module.exports = citySchema;
