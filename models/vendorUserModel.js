import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  accountType: String,
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  phone: String,
});

// Explicit collection name
const User = mongoose.model('User', userSchema, 'vendors');
export default User;
