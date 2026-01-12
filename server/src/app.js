import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import clientRoutes from "./routes/client.routes.js";
import measurementRoutes from "./routes/measurement.routes.js";
import { protect as authMiddleware } from "./middleware/auth.middleware.js";

const app = express();

// 🔥 REQUIRED FOR COOKIES ON RENDER / HTTPS
app.set("trust proxy", 1);

// 🔥 SAFARI-SAFE CORS CONFIG
const allowedOrigins = [
  "http://localhost:3000",
  "https://measure-pro.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile apps, curl, postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 VERY IMPORTANT FOR SAFARI
app.options("*", cors());

// BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/clients", authMiddleware, clientRoutes);
app.use("/api/measurements", measurementRoutes);

export default app;
