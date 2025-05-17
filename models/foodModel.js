import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0, required: true },
  finalPrice: { type: Number },
  image: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  availability: { type: Boolean, default: true }
}, {
  timestamps: true // ✅ Enables createdAt and updatedAt automatically
});

// Calculate finalPrice before save/update
foodSchema.pre('save', function (next) {
  this.finalPrice = this.price - this.discount;
  next();
});

foodSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.price !== undefined || update.discount !== undefined) {
    update.finalPrice = update.price - update.discount;
  }
  next();
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);
export default foodModel;
