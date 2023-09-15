const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  uuid: {
    type: String,
  },
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
});

module.exports = mongoose.model("User", userSchema);