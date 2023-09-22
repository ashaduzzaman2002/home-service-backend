const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  email: {
    type: String,
  },
  otp: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
