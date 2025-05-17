import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

// GST Rates
const AC_GST_RATE = 0.28;  // 28% GST for "ac" category
const DEFAULT_GST_RATE = 0.18;  // 18% GST for other categories

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
    let totalGst = 0;
    const detailedCart = [];

    // Loop through cartData to fetch food items and calculate GST
    for (let itemId in cartData) {
      const item = await foodModel.findById(itemId);

      if (item) {
        const quantity = cartData[itemId];
        const itemSubtotal = item.finalPrice * quantity;

        // Determine GST based on the category
        const gstRate = item.category.toLowerCase() === 'ac' ? AC_GST_RATE : DEFAULT_GST_RATE;
        const gstAmount = itemSubtotal * gstRate;

        subtotal += itemSubtotal;
        totalGst += gstAmount;

        // Push item details to the response data
        detailedCart.push({
          itemId: item._id,
          name: item.name,
          category: item.category,
          quantity,
          price: item.price,
          discount: item.discount,
          finalPrice: item.finalPrice,
          gstRate,
          gstAmount,
          itemSubtotal
        });
      }
    }

    const total = subtotal + totalGst;

    // Return cart data with subtotal, GST, and total amount
    res.json({
      success: true,
      items: detailedCart,
      subtotal,
      gstAmount: totalGst,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

export { addToCart, removeFromCart, getCart };
