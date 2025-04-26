import express from "express";
import { createInquiry, getAllInquiries } from "../controllers/inquiryController.js";

const router = express.Router();

router.post("/submit", createInquiry); // POST request to store inquiry
router.get("/all", getAllInquiries); // GET request to fetch all inquiries

export default router;
