import Product from '../models/productModel.js';

// POST: Add new product
export const addProduct = async (req, res) => {
  try {
    const { name, description, category, stock, price, discountPrice } = req.body;
    const image = req.file ? req.file.filename : null;
    const finalPrice = price - discountPrice;

    const newProduct = new Product({
      name,
      description,
      category,
      stock,
      price,
      discountPrice,
      finalPrice,
      image,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};

// GET: Fetch all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Must return array
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};
// DELETE: Delete selected products
export const deleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No product IDs provided' });
    }

    const result = await Product.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: `${result.deletedCount} products deleted.` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting products', error: error.message });
  }
};
