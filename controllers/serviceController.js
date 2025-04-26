// controllers/serviceController.js
import mongoose from 'mongoose';  // Add this import
import Service from '../models/Service.js';
import userModel from '../models/userModel.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { sendReminderEmail } from '../utils/emailService.js';
import cron from 'node-cron';

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new service
export const createService = async (req, res) => {
  try {
    const { title, price, rating, category, userId, itemId } = req.body;
    const user = await userModel.findById(userId);
    const newService = new Service({
      title,
      price,
      rating,
      category,
      userId,
      mobileNumber: user.phone, // Include mobileNumber
      itemId,
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Update an existing service
export const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceReminders = async (req, res) => {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Find services completed 90 days ago
    const services = await Service.find({
      lastServiceDate: { $lte: ninetyDaysAgo },
      status: 'completed',
    }).populate('userId');

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const checkServiceReminders = async () => {
  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Find services that were completed 90 days ago
    const services = await Service.find({
      lastServiceDate: { $lte: ninetyDaysAgo },
      status: 'completed',
    }).populate('userId');

    for (const service of services) {
      if (service.userId?.email) {
        await sendReminderEmail(service.userId.email, service.title);
        console.log(`Reminder email sent to ${service.userId.email}`);
      }
    }
  } catch (error) {
    console.error('Error checking service reminders:', error);
  }
};

// Schedule the job to run every day at midnight
cron.schedule('0 0 * * *', checkServiceReminders);






