const mongoose = require("mongoose");

/* flbpepgk */
const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    max: 255,
    min: 2
  },
  lastname: {
    type: String,
    required: true,
    max: 255,
    min: 2
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
    min: 8
  },
  gender: {
    type: String,
    required: true
  },
  keystore: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", UserSchema);
