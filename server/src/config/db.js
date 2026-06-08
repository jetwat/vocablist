// config/db.js
// ทำหน้าที่เดียว: เชื่อมต่อ MongoDB แล้วบอกผล
// แยกออกมาจาก server.js เพื่อให้ testable และ reusable

import mongoose from "mongoose";

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
