// routes/serviceRoutes.js
import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceReminders,
  
} from '../controllers/serviceController.js';


const router = express.Router();

// Route to fetch services needing reminders (Move this above /:id)
router.get('/reminders', getServiceReminders);

// GET all services
router.get('/', getAllServices);

// GET a single service by ID
router.get('/:id', getServiceById);

// POST a new service
router.post('/', createService);

// PUT to update an existing service
router.put('/:id', updateService);

// DELETE a service
router.delete('/:id', deleteService);






export default router;

