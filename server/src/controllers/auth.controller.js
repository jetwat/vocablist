// controllers/auth.controller.js
//
// Controller = logic ตรงกลาง: รับ req → ทำงาน → ส่ง res
// ไม่รู้จัก routes, ไม่รู้จัก middleware → separation of concerns
//
// generateToken แยกออกมาเป็น helper เพราะใช้ทั้ง register และ login

import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/user.model.js";

// helper: สร้าง JWT แล้วยัดลง httpOnly cookie
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("token", token, {
    httpOnly: true, // JS อ่านไม่ได้ → กันXSS
    secure: process.env.NODE_ENV === "production", // HTTPS only ใน prod
    sameSite: "strict", // กัน CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน (ms)
  });
};

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  // password จะถูก hash อัตโนมัติโดย pre-save hook ใน model
  const user = await User.create({ email, password });

  generateToken(res, user._id);

  res.status(201).json({
    success: true,
    data: { _id: user._id, email: user.email },
  });
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email });

  // เช็ค user และ password พร้อมกัน → ไม่บอก attacker ว่าอะไรผิด
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  generateToken(res, user._id);

  res.status(200).json({
    success: true,
    data: { _id: user._id, email: user.email },
  });
});

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (req, res) => {
  // clear cookie โดยส่ง cookie ว่างที่หมดอายุทันที
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ success: true, data: null });
});
