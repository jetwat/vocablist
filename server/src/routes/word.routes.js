// routes/word.routes.js
//
// สังเกต: /export ต้องอยู่ก่อน /:id
// เพราะ Express match routes ตามลำดับ — ถ้า /:id อยู่ก่อน
// Express จะ treat "export" เป็น id แทน

import { Router } from "express";
import protect from "../middleware/protect.js";
import optionalProtect from "../middleware/optionalProtect.js";
import {
  extract,
  saveWords,
  getWords,
  deleteWord,
  exportWords,
  skipWord,
  undoSkip,
} from "../controllers/word.controller.js";

const router = Router();

// สังเกต: /export, /skipped ต้องอยู่ก่อน /:id ทั้งหมด
router.post("/extract", optionalProtect, extract);  // public แต่รู้จัก user ถ้า login
router.get("/export", protect, exportWords);
router.post("/skipped", protect, skipWord);
router.delete("/skipped/:word", protect, undoSkip);
router.route("/").get(protect, getWords).post(protect, saveWords);
router.delete("/:id", protect, deleteWord);

export default router;
