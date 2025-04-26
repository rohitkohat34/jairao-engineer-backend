import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers['authorization'];
    if (!token || token === "Bearer null") {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    if (token.startsWith("Bearer ")) token = token.slice(7).trim();
    if (!token || token.split(".").length !== 3) {
      return res.status(400).json({ success: false, message: "Malformed token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // Add this line
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
