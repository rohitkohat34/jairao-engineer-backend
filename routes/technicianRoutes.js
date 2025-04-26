import express from "express";
import { createService, getAllServices, updateServiceStatus } from "../controllers/technicianController.js";

const router = express.Router();

// Technician Service Routes
router.post("/create", createService);
router.get("/", getAllServices);
router.put("/update/:id", updateServiceStatus);

export default router;
