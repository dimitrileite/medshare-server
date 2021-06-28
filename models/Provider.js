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
  documentation: {
    type: String,
    required: true
  },
  whatsapp: {
    type: String
  },
  instagram: {
    type: String    
  },
  rating: {
    type: String,
    default: 5  
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Provider', ProviderSchema);
