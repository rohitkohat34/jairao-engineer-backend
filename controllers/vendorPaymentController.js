import vendorPaymentModel from '../models/vendorPaymentModel.js';
import Razorpay from 'razorpay';
import orderModel from '../models/orderModel.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a payment order for a vendor
// Create payment for vendor for their items in the order
export const createVendorPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const vendorId = req.userId;

    const order = await orderModel.findById(orderId).populate('items._id');
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    let vendorAmount = 0;
    order.items.forEach(item => {
      if (item._id?.createdBy?.toString() === vendorId) {
        vendorAmount += item._id.finalPrice * item.quantity;
      }
    });

    if (vendorAmount === 0) {
      return res.status(400).json({ success: false, message: "No items for this vendor in this order" });
    }

    // Always create a payment record even for COD
    let existing = await vendorPaymentModel.findOne({ orderId, vendorId });
    if (!existing) {
      existing = new vendorPaymentModel({
        orderId,
        vendorId,
        amount: vendorAmount,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? 'Pending' : 'Pending',
      });
      await existing.save();
    }

    // Generate Razorpay order even for COD to enable "Pay Now"
    const razorpayOrder = await razorpay.orders.create({
      amount: vendorAmount * 100,
      currency: "INR",
      receipt: `vendor_${vendorId}_order_${orderId}`,
    });

    existing.razorpayOrderId = razorpayOrder.id;
    await existing.save();

    return res.json({
      success: true,
      vendorPaymentId: existing._id,
      razorpayOrderId: razorpayOrder.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      amount: vendorAmount,
    });
  } catch (error) {
    console.error("Error in createVendorPayment:", error);
    res.status(500).json({ success: false, message: "Error creating vendor payment" });
  }
};





// Update payment status after payment verification
export const updateVendorPaymentStatus = async (req, res) => {
  try {
    const { vendorPaymentId, paymentStatus, razorpayPaymentId } = req.body;
    const updateData = { paymentStatus };
    if (razorpayPaymentId) updateData.razorpayPaymentId = razorpayPaymentId;

    const payment = await vendorPaymentModel.findByIdAndUpdate(vendorPaymentId, updateData, { new: true });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    return res.json({ success: true, payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating payment status." });
  }
};

// Get balance payments for logged-in vendor
export const getVendorBalances = async (req, res) => {
  try {
    const vendorId = req.userId;
    // Get all vendor payments for the vendor grouped by orderId
    const balances = await vendorPaymentModel.find({ vendorId, paymentStatus: 'Pending' })
      .populate('orderId')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: balances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching balances." });
  }
};

