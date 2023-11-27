const { Schema, Types } = require("mongoose");
const { autoIncrement } = require("../../autoIncremant/methods/autoIncrement");

const docReqSchema = new Schema({
  id: { type: Number },
  flag: { type: String, required: true, enum: ["idDoc", "cardDoc"] },
  docs: { type: [String] },
  status: { type: String, default: "pending", enum: ["pending", "accepted", "rejected"] },
  lawyer: { type: Number },
  is_active: { type: Boolean, default: true },
  rejectReason: { type: String, }
}, { timestamps: true });

docReqSchema.pre('save', autoIncrement('id'));
module.exports = docReqSchema;
