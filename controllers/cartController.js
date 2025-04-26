import userModel from "../models/userModel.js";

const GST_RATE = 0.18; // 18% GST

// Add items to user cart 
const addToCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    cartData[req.body.itemId] = (cartData[req.body.itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    if (cartData[req.body.itemId]) {
      cartData[req.body.itemId] -= 1;
      if (cartData[req.body.itemId] <= 0) {
        delete cartData[req.body.itemId]; // Remove item if quantity is zero
      }
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Fetch user cart data with GST included
const getCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    
    let subtotal = 0;
    Object.entries(cartData).forEach(([itemId, quantity]) => {
      const item = userData.food_list.find(item => item._id === itemId);
      if (item) {
        subtotal += item.finalPrice * quantity;
      }
    });

    const gstAmount = subtotal * GST_RATE;  // Calculate GST (18%)
    const total = subtotal + gstAmount;    // Calculate the total including GST

    // Return cart data with subtotal, GST, and total amount
    res.json({ success: true, cartData, subtotal, gstAmount, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
