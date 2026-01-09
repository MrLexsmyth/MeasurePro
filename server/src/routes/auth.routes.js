import express from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Add Cache-Control header to prevent 304 caching
router.use("/me", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Keep GET /me
router.get("/me", protect, (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
}, getMe);


export default router;
