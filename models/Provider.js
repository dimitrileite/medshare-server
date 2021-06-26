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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Provider', ProviderSchema);
