const mongoose = require('mongoose');

const idCounterSchema = new mongoose.Schema({
  model: String,
  field: String,
  count: Number,
},);

module.exports = idCounterSchema;