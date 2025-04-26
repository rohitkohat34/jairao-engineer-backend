import mongoose from 'mongoose';

const vendorLoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const VendorLogin = mongoose.model('vendorlogin', vendorLoginSchema); // Collection name: 'vendorlogin'

export default VendorLogin;
