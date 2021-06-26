var mongoose = require("mongoose");

var ProviderSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Provider', ProviderSchema);
