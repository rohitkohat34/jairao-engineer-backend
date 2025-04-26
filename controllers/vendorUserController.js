import User from '../models/vendorUserModel.js';

// Register User (For Testing)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, accountType } = req.body;

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email: email.trim().toLowerCase(), password, phone, accountType });
    await newUser.save();

    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const { name, password, phone } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { name, password, phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    const deletedUser = await User.findOneAndDelete({ email: email.trim().toLowerCase() });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
