import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  stock: Number,
  price: Number,
  discountPrice: Number,
  finalPrice: Number,
  image: String,
}, {
  timestamps: true,
  collection: 'vendorproducts',
});

const Product = mongoose.model('Product', productSchema);
export default Product;
