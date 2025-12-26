import express from "express";
import {
  createMeasurement,
  getClientMeasurements,
  deleteMeasurement,
  updateMeasurement,
} from "../controllers/measurement.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createMeasurement);
router.get("/client/:clientId", protect, getClientMeasurements);

router.delete("/:id", protect, deleteMeasurement);
router.put("/:id", protect, updateMeasurement);


export default router;
