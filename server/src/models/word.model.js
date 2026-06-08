// models/word.model.js
//
// ref: "User" ทำให้ Mongoose รู้ว่า userId ชี้ไปที่ User collection
// → ใช้ .populate("userId") ได้ในอนาคตถ้าต้องการ join ข้อมูล

import mongoose from "mongoose";

const wordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // เพิ่ม index เพราะ query บ่อยด้วย userId
    },
    word: {
      type: String,
      required: [true, "Word is required"],
      trim: true,
    },
    source: {
      type: String,
      maxlength: [200, "Source text too long"],
      trim: true,
    },
  },
  {
    timestamps: true, // savedAt ≈ createdAt
  }
);

// compound index: ป้องกัน user เดียวกัน save คำซ้ำ
wordSchema.index({ userId: 1, word: 1 }, { unique: true });

const Word = mongoose.model("Word", wordSchema);
export default Word;
