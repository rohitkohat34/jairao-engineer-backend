import mongoose from 'mongoose';

const adminLoginSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // NOTE: In production, use hashed passwords
  },
  { collection: 'adminlogin', timestamps: true }
);

const AdminLogin = mongoose.model('AdminLogin', adminLoginSchema);
export default AdminLogin;
