import Contact from "../models/contactModel.js";

export const submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = new Contact({ firstName, lastName, email, phone, message });
    await newContact.save();

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
