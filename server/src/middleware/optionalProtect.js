// middleware/optionalProtect.js
//
// เหมือน protect แต่ไม่ throw ถ้าไม่มี token
// ใช้กับ routes ที่ guest ก็เข้าได้ แต่ถ้า login อยู่จะได้ req.user มาด้วย

import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/user.model.js";

const optionalProtect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
  } catch {
    // token หมดอายุหรือไม่ valid → treat as guest
  }

  next();
});

export default optionalProtect;
