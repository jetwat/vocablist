// utils/extractWords.js
//
// Pure function — ไม่มี side effect, ไม่แตะ DB
// รับ string → คืน array of unique words
//
// Logic:
//  1. lowercase ทั้งหมด
//  2. แทน punctuation/digits/special chars ด้วย space
//  3. split ด้วย whitespace
//  4. กรองคำที่สั้นเกินไป (< 2 ตัวอักษร) ออก
//  5. dedupe ด้วย Set

const extractWords = (text) => {
  if (!text || typeof text !== "string") return [];

  const words = text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ") // เก็บ apostrophe และ hyphen ไว้ (it's, well-known)
    .split(/\s+/)
    .filter((w) => w.length >= 2) // กรองคำสั้นเกิน เช่น "a", "I"
    .filter((w) => /[a-z]{2,}/.test(w)); // ต้องมี letter จริงๆ อย่างน้อย 2 ตัว

  // Set กรอง duplicate, spread กลับเป็น array
  return [...new Set(words)];
};

export default extractWords;
