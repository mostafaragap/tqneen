const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    key: {
      type: String,
      required: true,
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

imageSchema.index({ createdAt: 1, url: 1 });
module.exports = imageSchema;
