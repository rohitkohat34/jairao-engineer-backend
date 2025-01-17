import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0, required: true },
  finalPrice: { type: Number },
  image: { type: String, required: true },
  category: { type: String, required: true }
})

// Calculate finalPrice before saving
foodSchema.pre('save', function (next) {
  this.finalPrice = this.price - this.discount;
  next();
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema)

export default foodModel;