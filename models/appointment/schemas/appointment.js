const { Schema } = require("mongoose");
const { autoIncrement } = require("../../autoIncremant/methods/autoIncrement");
let statusEnum = require("../../../constants/appointmentStatus")
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const appointmentSchema = new Schema({
  id: { type: Number },
  topic: {
    type: Number,
    required: true
  },
  specification: {
    type: Number,
    required: true
  },
  description: {
    type: String,
  },
  customer: {
    type: Number,
    required: true
  },
  lawyer: {
    type: Number,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  isEmmergency: {
    type: Boolean,
    required: true,
    default: false
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true
  },

  status: {
    type: String,
    enum: statusEnum,
    default: "pending"
  },

  files: {
    type: [String],
  },

  images: {
    type: [String]
  },
  payment: {
    isPaid: Boolean,
    transactionId: String
  },
  rejectReason: {
    type: String,
    required: function () {
      return this.status === 'rejected';
    }
  }

}, { timestamps: true });

appointmentSchema.plugin(mongoosePaginate);
appointmentSchema.plugin(aggregatePaginate);
appointmentSchema.pre('save', autoIncrement('id'));
module.exports = appointmentSchema;