import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import clientRoutes from "./routes/client.routes.js";
import measurementRoutes from "./routes/measurement.routes.js";
import { protect as authMiddleware } from "./middleware/auth.middleware.js";



const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// ✅ BODY PARSERS FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ ROUTES AFTER
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/clients", authMiddleware, clientRoutes);
app.use("/api/measurements", measurementRoutes);

export default app;
