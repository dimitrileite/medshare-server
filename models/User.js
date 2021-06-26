const mongoose = require("mongoose");

/* aflbpeppuprb */
const UserSchema = mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true,
    max: 255,
    min: 6
  },
  lastname: {
    type: String,
    required: true,
    max: 255,
    min: 6
  },
  birthdate: {
    type: Date,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6
  },
  password: {
    type: String,
    required: true,
    min: 1024,
    min: 6
  },
  publickey: {
    type: String,
    required: true
  },
  privatekey: {
    type: String,
    required: true
  },
  balance: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);
