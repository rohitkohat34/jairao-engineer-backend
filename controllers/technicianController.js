import Technician from "../models/technicianModel.js";

// Create Service
export const createService = async (req, res) => {
  try {
    const { category, subCategory, rate, spareParts, paymentMethod } = req.body;

    // Validate input
    if (!category || !subCategory || !rate || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Calculate total amount
    const totalAmount = rate + (spareParts?.reduce((acc, part) => acc + part.rate, 0) || 0);

    // Create new service
    const newService = new Technician({ category, subCategory, rate, spareParts, totalAmount, paymentMethod });
    await newService.save();

    res.status(201).json({ message: "Service added successfully!", service: newService });
  } catch (error) {
    res.status(500).json({ message: "Error adding service", error: error.message });
  }
};

// Get All Services
export const getAllServices = async (req, res) => {
  try {
    const services = await Technician.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error: error.message });
  }
};

// Update Service Status
export const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["Pending", "Started", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find and update service
    const service = await Technician.findByIdAndUpdate(id, { status }, { new: true });

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.json({ message: "Service status updated", service });
  } catch (error) {
    res.status(500).json({ message: "Error updating service", error: error.message });
  }
};
