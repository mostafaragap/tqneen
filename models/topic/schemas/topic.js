const { Schema } = require("mongoose");
const { autoIncrement } = require("../../autoIncremant/methods/autoIncrement");
const nameSchema = require("../../general/name-schema");

const topicSchema = new Schema({
  id: { type: Number },
  name: {
    type: nameSchema,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  specialization: {
    type: Number,
    required: true
  }
});

topicSchema.pre('save', autoIncrement('id'));
module.exports = topicSchema;
