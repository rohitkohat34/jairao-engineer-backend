import fs from "fs";
import PDFDocument from "pdfkit";
import Inquiry from "../models/inquiryModel.js";
import path from "path";
import twilio from "twilio";

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Function to generate PDF
const generatePDF = (inquiry) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filePath = `invoices/inquiry_${inquiry._id}.pdf`;
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);
    doc.fontSize(18).text("Inquiry Details", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${inquiry.name}`);
    doc.text(`Email: ${inquiry.email}`);
    doc.text(`Phone: ${inquiry.phone}`);
    doc.text(`Address: ${inquiry.address}`);
    doc.text(`Message: ${inquiry.message}`);
    doc.end();

    writeStream.on("finish", () => resolve(filePath));
    writeStream.on("error", reject);
  });
};

// Store Inquiry and Send WhatsApp Message with Raw Text
export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, address, message } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const inquiry = new Inquiry({ name, email, phone, address, message });
    await inquiry.save();

    // Generate PDF
    const pdfPath = await generatePDF(inquiry);
    inquiry.pdfUrl = `http://localhost:3000/${pdfPath}`;
    await inquiry.save();

    // Construct detailed WhatsApp message
    const twilioMessage = `
📩 *New Inquiry Received*

👤 *Name:* ${name}
📧 *Email:* ${email}
📱 *Phone:* ${phone}
🏠 *Address:* ${address}
📝 *Message:* ${message}

🔗 PDF: ${inquiry.pdfUrl}
    `;

    // Send WhatsApp message using Twilio Sandbox
    await twilioClient.messages.create({
      from: 'whatsapp:+14155238886',  // Twilio Sandbox WhatsApp number
      to: 'whatsapp:+917083736905',   // Replace with a number that has joined sandbox
      body: twilioMessage
    });

    console.log("WhatsApp message sent successfully");

    res.status(201).json({
      message: "Inquiry submitted successfully!",
      pdfUrl: inquiry.pdfUrl,
    });

  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

// Fetch all inquiries
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};
