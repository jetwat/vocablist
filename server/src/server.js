// server.js — entry point
//
// ทำหน้าที่เดียว: load env → connect DB → start listening
// ถ้า DB connect ไม่ได้ → process.exit(1) ดีกว่าปล่อยให้ server ทำงานโดยไม่มี DB

import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
