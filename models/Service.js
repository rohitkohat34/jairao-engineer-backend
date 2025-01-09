// models/Service.js
import mongoose from 'mongoose';

const serviceSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    category: { type: String, required: true }, // e.g., 'Repair', 'Installation'
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    mobileNumber: { type: String, required: true },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;
