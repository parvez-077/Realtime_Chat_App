import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5001"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// simple root for dev
app.get('/', (req, res) => {
  res.send('<h2>Backend running</h2><p>API endpoints: /api/auth, /api/messages</p>');
});

// serve frontend build if exists
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// debug
console.log('DEBUG: MONGO_URI=', process.env.MONGO_URI || process.env.MONGODB_URI);

(async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log("server is running on PORT:" + PORT);
    });
  } catch (err) {
    console.error("Failed to start server because DB connection failed:", err);
    process.exit(1);
  }
})();
