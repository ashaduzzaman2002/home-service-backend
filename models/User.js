const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
  },

  phone: {
    type: String,
  },

  password: {
    type: String,
  },

  role: {
    type: String,
    enum: ["user", "technician"],
    default: "user",
  },

  location: {
    type: String,
  },

  profession: {
    type: String,
  },
  
  experience: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
