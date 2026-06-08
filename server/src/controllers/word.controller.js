// controllers/word.controller.js

import asyncHandler from "../middleware/asyncHandler.js";
import Word from "../models/word.model.js";
import SkippedWord from "../models/skippedWord.model.js";
import extractWords from "../utils/extractWords.js";

// POST /api/v1/words/extract  (public — ถ้า login อยู่จะกรอง saved+skipped ออกให้)
export const extract = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    res.status(400);
    throw new Error("Please provide text to extract");
  }

  let words = extractWords(text);

  let skippedInText = [];

  if (req.user) {
    const [savedWords, skippedWords] = await Promise.all([
      Word.find({ userId: req.user._id }).select("word").lean(),
      SkippedWord.find({ userId: req.user._id }).select("word").lean(),
    ]);

    const savedSet = new Set(savedWords.map((w) => w.word));
    const skippedSet = new Set(skippedWords.map((w) => w.word));

    skippedInText = words.filter((w) => skippedSet.has(w.toLowerCase()));
    words = words.filter((w) => !savedSet.has(w.toLowerCase()) && !skippedSet.has(w.toLowerCase()));
  }

  res.status(200).json({ success: true, data: { words, skipped: skippedInText } });
});

// POST /api/v1/words  (ต้อง login)
// รับ array of { word, source } → save ลง DB
// ใช้ insertMany + ordered:false เพื่อให้ duplicate error ไม่ block คำอื่น
export const saveWords = asyncHandler(async (req, res) => {
  const { words } = req.body; // [{ word, source }, ...]

  if (!Array.isArray(words) || words.length === 0) {
    res.status(400);
    throw new Error("Please provide an array of words");
  }

  const docs = words.map(({ word, source }) => ({
    userId: req.user._id,
    word: word?.trim().toLowerCase(),
    source: source?.trim().slice(0, 200),
  }));

  // ordered: false → insert ต่อแม้บาง doc จะ duplicate
  // { lean: true } ไม่ใช้ที่นี่ แต่ insertMany return plain objects อยู่แล้ว
  let inserted = [];
  try {
    inserted = await Word.insertMany(docs, { ordered: false });
  } catch (err) {
    // BulkWriteError code 11000 = duplicate key
    // ถ้า error อื่น → re-throw
    if (err.code !== 11000 && err.name !== "BulkWriteError") throw err;
    // เอาเฉพาะที่ insert สำเร็จ
    inserted = err.insertedDocs ?? [];
  }

  res.status(201).json({ success: true, data: { saved: inserted.length } });
});

// GET /api/v1/words  (ต้อง login)
export const getWords = asyncHandler(async (req, res) => {
  // lean() คืน plain JS object แทน Mongoose document → เบากว่า
  const words = await Word.find({ userId: req.user._id })
    .sort({ createdAt: -1 }) // ใหม่สุดขึ้นก่อน
    .lean();

  res.status(200).json({ success: true, data: { words } });
});

// DELETE /api/v1/words/:id  (ต้อง login)
export const deleteWord = asyncHandler(async (req, res) => {
  // หาพร้อมเช็ค ownership ใน query เดียว
  const word = await Word.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id, // ป้องกัน user A ลบคำของ user B
  });

  if (!word) {
    res.status(404);
    throw new Error("Word not found");
  }

  res.status(200).json({ success: true, data: null });
});

// GET /api/v1/words/export  (ต้อง login)
// Return .txt file — browser จะ download อัตโนมัติ
export const exportWords = asyncHandler(async (req, res) => {
  const words = await Word.find({ userId: req.user._id })
    .sort({ word: 1 }) // เรียง a-z สำหรับ export
    .lean();

  const content = words.map((w) => w.word).join("\n");

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", "attachment; filename=vocab.txt");
  res.status(200).send(content);
});

// POST /api/v1/words/skipped  (ต้อง login)
export const skipWord = asyncHandler(async (req, res) => {
  const { word } = req.body;

  if (!word?.trim()) {
    res.status(400);
    throw new Error("Please provide a word");
  }

  await SkippedWord.findOneAndUpdate(
    { userId: req.user._id, word: word.trim().toLowerCase() },
    { userId: req.user._id, word: word.trim().toLowerCase() },
    { upsert: true }
  );

  res.status(201).json({ success: true });
});

// DELETE /api/v1/words/skipped/:word  (ต้อง login)
export const undoSkip = asyncHandler(async (req, res) => {
  await SkippedWord.findOneAndDelete({
    userId: req.user._id,
    word: req.params.word.toLowerCase(),
  });

  res.status(200).json({ success: true });
});
