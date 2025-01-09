import express from "express"
import { PeerServer } from 'peer';
import path from 'path';
import cors from "cors"

import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import serviceRoutes from './routes/serviceRoutes.js';

//app config
const app = express()
const port = 4000

const peerServer = PeerServer({ port: 9000, path: '/myapp' });

//middleware
app.use(express.json())
app.use(cors())

//DB connection
connectDB();

//api endpoint
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use('/api/services', serviceRoutes);

app.get("/",(req, res)=>{
  res.send("API Working")
})

app.listen(port,()=>{
  console.log(`Server started on http://localhost:${port}`)
})


app.listen(8000, () => {
  console.log('Backend server is running on http://localhost:8000');
});