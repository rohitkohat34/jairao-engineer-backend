import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    message: { type: String },
    pdfUrl: { type: String }, // Store PDF file path
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
