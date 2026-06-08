// routes/index.js
// Single entry point สำหรับ routes ทั้งหมด
// app.js ต้อง import แค่ที่นี่ที่เดียว

import { Router } from "express";
import authRoutes from "./auth.routes.js";
import wordRoutes from "./word.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/words", wordRoutes);

export default router;
