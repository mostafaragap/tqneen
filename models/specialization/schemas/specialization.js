const { Schema } = require("mongoose");
const { autoIncrement } = require("../../autoIncremant/methods/autoIncrement");
const nameSchema = require("../../general/name-schema");

const specializationSchema = new Schema({
  id: { type: Number },
  name: {
    type: nameSchema,
    required: true
  }

}, { timestamps: true });

specializationSchema.pre('save', autoIncrement('id'));
module.exports = specializationSchema;
