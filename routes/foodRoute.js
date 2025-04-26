// routes/foodRoute.js

import express from "express";
import { addFood, listFood, removeFood, updateFoodPrice, listUserFood } from "../controllers/foodController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => cb(null, `${Date.now()}${file.originalname}`)
});

const upload = multer({ storage });

// Remove authMiddleware from the `listFood` route to make it publicly accessible
foodRouter.post("/add", authMiddleware, upload.single("image"), addFood);
foodRouter.get("/list", listFood); // No authentication needed here anymore
// Get foods created by the logged-in user (authentication required)
foodRouter.get("/user-list", authMiddleware, listUserFood);

foodRouter.post("/remove", authMiddleware, removeFood);
foodRouter.post('/update-price', authMiddleware, updateFoodPrice);

export default foodRouter;
