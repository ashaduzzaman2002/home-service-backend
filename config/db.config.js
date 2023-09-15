const mongoose = require("mongoose");

exports.dbConnection = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected successfully");
  } catch (error) {
    console.log(error);
  }
};
