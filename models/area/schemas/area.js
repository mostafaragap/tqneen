const { Schema, Types } = require("mongoose");
const { autoIncrement } = require("../../autoIncremant/methods/autoIncrement");
const nameSchema = require("../../general/name-schema");

const areaSchema = new Schema({
  id: { type: Number },
  name: {
    type: nameSchema,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  city: {
    type: Number,
    required: true
  }
});

areaSchema.pre('save', autoIncrement('id'));
module.exports = areaSchema;
