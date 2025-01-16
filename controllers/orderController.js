
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"
import serviceModel from "../models/Service.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


//place user order for frontend
const placeOrder = async (req, res) => {

  const frontend_url = "http://localhost:5173"

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address
    })
    let newAddedOrder = await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity
    }))

    let deliveryCharge = 200;
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges"
        },
        unit_amount: deliveryCharge,
      },
      quantity: 1
    })

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    })
    let itemList = req.body.items;
    itemList?.forEach(async (item) => {
      await new serviceModel({
        title: "Installation Service",
        price: 499,
        rating: 4.6,
        category: 'Installation',
        userId: req.body.userId,
        mobileNumber: req.body.address.phone, // Replace with actual mobile number
        itemId: item._id,
        quantity: item.quantity,
        amount: 499 * item.quantity,
        orderId: newAddedOrder._id,
        payment: false,
        status: 'pending',
      }).save()
    });
    res.json({ success: true, session_url: session.url })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }


}

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

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId })
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

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

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus }