import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

// Serve PDF file
router.get("/:filename", (req, res) => {
  const filePath = path.join("invoices", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath, { root: "." });
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

export default router;
