import mongoose from "mongoose";

const vendorPaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // createdBy of food item
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Razorpay', 'COD', 'Stripe', 'Balance'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  razorpayOrderId: { type: String }, // For Razorpay integration
  razorpayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const vendorPaymentModel = mongoose.model('vendorPayment', vendorPaymentSchema);
export default vendorPaymentModel;
