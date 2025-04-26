import express from "express";
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

// Fix: Changed "/contact" to "/" so the final route remains "/api/contact"
router.post("/", submitContactForm);

export default router;
