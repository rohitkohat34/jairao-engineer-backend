import AdminLogin from '../models/adminLoginModel.js';
import jwt from 'jsonwebtoken';
// Get all admins (optional)
export const getAdmins = async (req, res) => {
  try {
    const admins = await AdminLogin.find();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving admins', error: err });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await AdminLogin.findOne({ username });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      admin: { id: admin._id, username: admin.username },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// Optional: Add admin creation (only for initial use)
export const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await AdminLogin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const newAdmin = new AdminLogin({ username, password }); // In production, hash password
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created', admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Error creating admin', error: err.message });
  }
};
