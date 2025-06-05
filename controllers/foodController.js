import foodModel from "../models/foodModel.js";
import fs from 'fs';

// ✅ Add food with multiple images
const addFood = async (req, res) => {
  const image_filenames = req.files.map(file => file.filename);

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    discount: req.body.discount,
    category: req.body.category,
    brand: req.body.brand,
    images: image_filenames, // Store multiple images
    createdBy: req.userId,
    availability: req.body.availability,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ✅ List all food (public)
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find(); // No user filter
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ✅ List food for a specific user (only their created items)
const listUserFood = async (req, res) => {
  try {
    const userId = req.userId;

    const foods = await foodModel.find({ createdBy: userId });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error fetching user foods:", error);
    res.status(500).json({ success: false, message: "Error fetching user foods" });
  }
};

// ✅ Remove food (check ownership)
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findOne({ _id: req.body.id, createdBy: req.userId });
    if (!food) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Delete image files from the server
    food.images.forEach(image => fs.unlink(`uploads/${image}`, () => {}));
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ✅ Update food price (check ownership)
const updateFoodPrice = async (req, res) => {
  try {
    const { id, price, discount } = req.body;
    if (!id || price === undefined || discount === undefined) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const food = await foodModel.findOne({ _id: id, createdBy: req.userId });
    if (!food) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const finalPrice = price - discount;
    await foodModel.findByIdAndUpdate(id, { price, discount, finalPrice });

    res.json({ success: true, message: "Price and discount updated successfully." });
  } catch (error) {
    console.error("Error updating price and discount:", error);
    res.status(500).json({ success: false, message: "Update failed." });
  }
};

export { addFood, listFood, removeFood, updateFoodPrice, listUserFood };
