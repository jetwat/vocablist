// app.js
//
// แยก app.js ออกจาก server.js เพื่อ:
//  - testability (import app ใน test โดยไม่ต้อง start server)
//  - clarity: app.js = middleware + routes, server.js = listen + DB

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true, // จำเป็นเพื่อส่ง cookie ข้าม origin
  })
);
app.use(express.json()); // parse JSON body
app.use(cookieParser()); // parse cookies → req.cookies

// --- Routes ---
app.use("/api/v1", routes);

// health check — Render และ uptime monitor เรียกเช็คที่นี่
app.get("/health", (req, res) => res.json({ status: "ok" }));

// --- Error Handler (ต้องอยู่หลัง routes เสมอ) ---
app.use(errorHandler);

export default app;
