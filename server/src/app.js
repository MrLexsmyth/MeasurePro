import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import clientRoutes from "./routes/client.routes.js";
import measurementRoutes from "./routes/measurement.routes.js";
import { protect as authMiddleware } from "./middleware/auth.middleware.js";

const app = express();

// 🔥 CRITICAL: DISABLE ETAG (FIXES 304 ISSUE)
app.set("etag", false);

// REQUIRED FOR RENDER (PROXY HTTPS)
app.set("trust proxy", 1);

const allowedOrigins = [
  "https://measure-pro.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// SAFARI PREFLIGHT FIX
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔥 AUTH ROUTES — NEVER CACHE
app.use("/api/auth", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/clients", authMiddleware, clientRoutes);
app.use("/api/measurements", measurementRoutes);

export default app;
