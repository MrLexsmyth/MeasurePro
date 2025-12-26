import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
} from "../controllers/client.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createClient);
router.get("/", getClients);
router.get("/:id", getClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
