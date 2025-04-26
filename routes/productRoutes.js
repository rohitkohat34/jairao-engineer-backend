import express from 'express';
import multer from 'multer';
import {
  addProduct,
  getAllProducts,
  deleteProducts,
} from '../controllers/productController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post('/', upload.single('image'), addProduct);
router.get('/', getAllProducts);
router.delete('/', deleteProducts); // ✅ Delete route added

export default router;
