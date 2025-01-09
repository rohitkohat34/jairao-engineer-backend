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
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order', required: true },
    payment: { type: Boolean, default: false },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;
