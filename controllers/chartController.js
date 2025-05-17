import mongoose from 'mongoose';
import foodModel from '../models/foodModel.js';
import orderModel from '../models/orderModel.js';

// 📊 Line Chart Data (Monthly Sales)
export const getLineChartData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const orders = await orderModel.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "foods",
          localField: "items._id",
          foreignField: "_id",
          as: "foodInfo"
        }
      },
      { $unwind: "$foodInfo" },
      { $match: { "foodInfo.createdBy": userId } },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const salesData = months.map(month => {
      const found = orders.find(d => d._id.month === month);
      return found ? found.totalSales : 0;
    });

    res.json({ success: true, data: { months, salesData } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 📊 Bar Chart Data (Sales by Category)
export const getBarChartData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const orderData = await orderModel.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "foods",
          localField: "items._id",
          foreignField: "_id",
          as: "foodDetails"
        }
      },
      { $unwind: "$foodDetails" },
      { $match: { "foodDetails.createdBy": userId } },
      {
        $group: {
          _id: "$foodDetails.category",
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    const categories = orderData.map(d => d._id);
    const salesData = orderData.map(d => d.totalSales);

    res.json({ success: true, data: { categories, salesData } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🥧 Pie Chart Data (Food Availability)
export const getPieChartData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const foodData = await foodModel.aggregate([
      { $match: { createdBy: userId, availability: { $in: [true, false] } } },
      {
        $group: {
          _id: "$availability",
          count: { $sum: 1 }
        }
      }
    ]);

    const labels = foodData.map(d => d._id ? "Available" : "Not Available");
    const data = foodData.map(d => d.count);

    res.json({ success: true, data: { labels, data } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
