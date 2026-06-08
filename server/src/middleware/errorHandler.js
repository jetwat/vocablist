// middleware/errorHandler.js
//
// Express รู้ว่านี่คือ "error handler" เพราะ parameter มี 4 ตัว (err, req, res, next)
// ต้องลง app.use() ท้ายสุดเสมอ หลัง routes ทั้งหมด
//
// Flow: controller throw error → asyncHandler catch → next(err) → errorHandler

const errorHandler = (err, req, res, next) => {
  // บางครั้ง error มาจาก Mongoose หรือ JWT โดยไม่มี statusCode
  // ถ้าไม่มี ใช้ 500 (Internal Server Error) เป็น default
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    // stack trace แสดงเฉพาะ dev เพื่อไม่เปิดเผย internals ใน production
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
