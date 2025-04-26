import express from 'express';
import {
  updateUser,
  deleteUser,
  registerUser
} from '../controllers/vendorUserController.js';

const router = express.Router();

router.post('/vendor', registerUser);
router.put('/update/:email', updateUser);
router.delete('/delete/:email', deleteUser);

export default router;
