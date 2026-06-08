// models/user.model.js
//
// Mongoose Schema = blueprint ของ document ใน MongoDB
// ตรง Schema นี้: hash password ก่อน save ด้วย pre-save hook
// → ไม่มีทางเก็บ plain-text password ลง DB ได้เลย

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // normalize ก่อน save เสมอ
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  {
    timestamps: true, // เพิ่ม createdAt, updatedAt ให้อัตโนมัติ
  }
);

// pre-save hook: ทำงานก่อน .save() ทุกครั้ง
// ถ้า password ไม่ได้ถูกแก้ไข → ข้ามไป (ไม่งั้น hash ซ้อน hash)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// instance method: เอาไว้เรียกบน user object เช่น user.matchPassword(...)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
