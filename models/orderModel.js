import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'food' },
    quantity: Number,
    price: Number,
    name: String,

  }],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Product Processing" },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false },
  paymentMethod: { type: String, default: "Online" },
  canceled: { type: Boolean, default: false },
  invoiceNumber: { type: String, unique: true, sparse: true } // ✅ Add this line
});



const orderModel = mongoose.model.order || mongoose.model("order",orderSchema)

export default orderModel;