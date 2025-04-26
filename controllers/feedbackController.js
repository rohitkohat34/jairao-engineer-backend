import Feedback from "../models/Feedback.js";

// Submit Feedback
export const submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const feedback = new Feedback({ name, email, message });
    await feedback.save();
    res.status(201).json({ success: true, message: "✅ Feedback submitted successfully!" });
  } catch (error) {
    console.error("❌ Error submitting feedback:", error);
    res.status(500).json({ success: false, message: "❌ Server error, try again later." });
  }
};

// Get Recent Feedback (last 5)
export const getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("❌ Error fetching feedback:", error);
    res.status(500).json({ success: false, message: "❌ Error fetching feedback." });
  }
};
