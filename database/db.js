const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Database Connected Successfully');    
  } catch (error) {
    console.log("connectToDatabase - error", error);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
