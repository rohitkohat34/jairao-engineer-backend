import express from "express"

import cors from "cors"

import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import serviceRoutes from './routes/serviceRoutes.js'
import technicianRoutes from './routes/technicianRoutes.js'
import contactRoutes from "./routes/contactRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js"
import vendorUserRoutes from "./routes/vendorUserRoutes.js"
import loginRoutes from './routes/loginRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminLoginRoutes from './routes/adminLoginRoutes.js'


import './controllers/serviceController.js'; // To ensure cron job runs

//app config
const app = express()
const port = 3000

//middleware
app.use(express.json())
app.use(cors())
app.use('/invoices', express.static('invoices')); 
app.use('/invoices', express.static('invoices')); 
app.use('/invoices', express.static('invoices')); // Serve PDF files

//DB connection
connectDB();

//api endpoint
app.use("/api/food", foodRouter)
app.use('/uploads', express.static('uploads'));
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use('/api/services', serviceRoutes);
app.use('/api/technician', technicianRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/vendorUser", vendorUserRoutes);
app.use('/api/vendor', loginRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminLoginRoutes);


app.get("/", (req, res) => {
  res.send("API Working")
})

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})