import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();



export default router;
