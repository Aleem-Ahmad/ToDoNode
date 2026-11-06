const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://aleemahmadghias_db_user:mv9AmjrasYoN3Phh@ac-fpja4gt-shard-00-00.x2f9ryh.mongodb.net:27017,ac-fpja4gt-shard-00-01.x2f9ryh.mongodb.net:27017,ac-fpja4gt-shard-00-02.x2f9ryh.mongodb.net:27017/todo_app?ssl=true&replicaSet=atlas-qclc1p-shard-0&authSource=admin";

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
