// middleware/protect.js
//
// Guard สำหรับ routes ที่ต้อง login ก่อน
// อ่าน JWT จาก httpOnly cookie (ปลอดภัยกว่า localStorage เพราะ JS อ่านไม่ได้)
//
// Flow:
//  1. อ่าน token จาก req.cookies.token
//  2. verify กับ JWT_SECRET
//  3. ดึง user จาก DB (ไม่เอา password)
//  4. แขวนไว้ที่ req.user → controller เอาไปใช้ต่อได้

import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/user.model.js";

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  // verify จะ throw เองถ้า token หมดอายุหรือถูกแก้ไข
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // ดึง user จริงจาก DB เพื่อให้ข้อมูล fresh เสมอ
  req.user = await User.findById(decoded.id).select("-password");

  if (!req.user) {
    res.status(401);
    throw new Error("Not authorized, user not found");
  }

  next();
});

export default protect;
