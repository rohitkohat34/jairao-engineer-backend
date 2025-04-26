import jwt from 'jsonwebtoken';
import VendorLogin from '../models/vendorUserModel.js';

export const loginVendor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await VendorLogin.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
