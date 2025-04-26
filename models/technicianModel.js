import mongoose from "mongoose";

const TechnicianSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    rate: { type: Number, required: true },
    spareParts: [{ name: String, rate: Number }],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Started", "Completed"], default: "Pending" },
  },
  { timestamps: true }
);

const Technician = mongoose.model("Technician", TechnicianSchema);

export default Technician;
