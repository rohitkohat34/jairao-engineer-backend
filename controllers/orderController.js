import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from 'razorpay'
import serviceModel from "../models/Service.js";
import easyinvoice from 'easyinvoice';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Resolve the directory path correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to create the directory if it does not exist
const ensureDirectoryExists = (directoryPath) => {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
};

//place user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const { items, amount, address, paymentMethod } = req.body;
    const userId = req.userId; // ✅ From token

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: userId missing" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: paymentMethod === "COD",
      status: paymentMethod === "COD" ? "Order Confirmed" : "Product Processing",
      paymentMethod,
    });

    let newAddedOrder = await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    if (paymentMethod === "COD") {
      return res.json({ success: true, message: "Order placed successfully (COD)" });
    } else if (paymentMethod === "Stripe") {
      const session = await stripe.checkout.sessions.create({
        line_items: items.map((item) => ({
          price_data: {
            currency: "inr",
            product_data: { name: item.name },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${frontend_url}/verify?success=true&orderId=${newAddedOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newAddedOrder._id}`,
      });

      return res.json({ success: true, session_url: session.url });
    } else if (paymentMethod === "Razorpay") {
      const razorpayOrder = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: newAddedOrder._id.toString(),
      });

      return res.json({
        success: true,
        orderId: newAddedOrder._id,
        order_id: razorpayOrder.id,
        razorpay_key: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount / 100,
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error placing order" });
  }
};


const generateInvoice = async (req, res) => {
  try {
      const orderId = req.params.orderId;
      const order = await orderModel.findById(orderId);

      if (!order) {
          return res.status(404).json({ success: false, message: 'Order not found' });
      }

      const invoicesDir = path.join(__dirname, '../invoices');
      ensureDirectoryExists(invoicesDir);
      const invoicePath = path.join(invoicesDir, `invoice-${orderId}.pdf`);

      // ✅ Return existing invoice if already generated
      if (fs.existsSync(invoicePath)) {
          return res.download(invoicePath);
      }

      // Calculate GST
      const gstRate = 0.18; // 18%
      const originalAmount = order.amount / (1 + gstRate);
      const gstAmount = order.amount - originalAmount;

      // Prepare invoice data
      const invoiceData = {
          sender: {
              company: "Jay Rao Engineer Solutions",
              address: "Chota Taj Bagh Rd, near HANUMAN TEMPLE, Ayurvedic Layout, SQURE, Nagpur",
              zip: "440024",
              city: "Nagpur",
              country: "India",
              custom1: "GSTIN: 27ALVPU9654L1ZQ"
          },
          client: {
              company: order.address.name || "Customer",
              address: order.address.street,
              zip: order.address.zip,
              city: order.address.city,
              country: order.address.country
          },
          information: {
              number: orderId,
              date: new Date().toISOString().split('T')[0],
          },
          products: order.items.map(item => ({
              quantity: item.quantity,
              description: item.name,
              taxRate: 18,
              price: item.price
          })),
          bottomNotice: "Thank you for your purchase! For support, contact us.",
          settings: { currency: "INR" }
      };

      // ✅ Retry mechanism for rate limits
      let invoicePdf;
      let attempts = 0;
      const maxAttempts = 3;
      const retryDelay = 5000; // 5 seconds

      while (attempts < maxAttempts) {
          try {
              invoicePdf = await easyinvoice.createInvoice(invoiceData);
              break;
          } catch (error) {
              if (error.statusCode === 429) { // Too Many Requests
                  attempts++;
                  console.warn(`Rate limit hit. Retrying in ${retryDelay / 1000} seconds...`);
                  await new Promise(resolve => setTimeout(resolve, retryDelay));
              } else {
                  throw error;
              }
          }
      }

      if (!invoicePdf) {
          return res.status(500).json({ success: false, message: "Failed to generate invoice after multiple attempts." });
      }

      fs.writeFileSync(invoicePath, invoicePdf.pdf, 'base64');
      res.download(invoicePath);

  } catch (error) {
      console.error("Error generating invoice:", error);
      res.status(500).json({ success: false, message: "Error generating invoice. Please try again later." });
  }
};






const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await serviceModel.updateMany({ orderId: orderId }, { payment: true });
      res.json({ success: true, message: "paid" })
    }
    else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" })
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

// user orders for frontend

// controllers/orderController.js

const userOrders = async (req, res) => {
  try {
    const userId = req.userId; // From middleware
    const orders = await orderModel.find({ userId }).sort({ date: -1 }); // Latest first
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};


//listing order for admin panel

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

//api for update order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
    res.json({ success: true, message: "Status Update" })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })

  }
}

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find and update the order status to "Canceled"
    const order = await orderModel.findByIdAndUpdate(orderId, { status: "Canceled", canceled: true }, { new: true });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order canceled successfully", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error canceling order" });
  }
};

const createdByOrders = async (req, res) => {
  try {
    const userId = req.userId;

    // ✅ Remove match from populate
    const orders = await orderModel.find({})
      .populate({
        path: 'items.food',
        select: 'createdBy name price', // Only fetch required fields
      });

    const filteredOrders = [];

    for (const order of orders) {
      const filteredItems = [];

      for (const item of order.items) {
        if (item.food && item.food.createdBy?.toString() === userId) {
          filteredItems.push({
            name: item.food.name,
            quantity: item.quantity,
            price: item.food.price,
          });
        }
      }

      if (filteredItems.length > 0) {
        filteredOrders.push({
          _id: order._id,
          userId: order.userId,
          amount: order.amount,
          address: order.address,
          status: order.status,
          date: order.date,
          payment: order.payment,
          paymentMethod: order.paymentMethod,
          canceled: order.canceled,
          items: filteredItems,
        });
      }
    }

    if (filteredOrders.length === 0) {
      return res.json({ success: false, message: "No orders found for this vendor" });
    }

    res.json({ success: true, data: filteredOrders });

  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};









export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, generateInvoice,cancelOrder,createdByOrders }
