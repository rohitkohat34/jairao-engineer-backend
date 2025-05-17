import express from "express"
import authMiddleware from "../middleware/auth.js"

import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus,generateInvoice,cancelOrder,createdByOrders,deleteOrder } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);

orderRouter.post("/verify",verifyOrder)
orderRouter.get("/invoice/:orderId", generateInvoice);
orderRouter.post("/userorders",authMiddleware, userOrders);
orderRouter.get('/list',listOrders);
orderRouter.post('/status',updateStatus)
orderRouter.post("/cancel", authMiddleware, cancelOrder); // New route for canceling orders
orderRouter.post("/vendororders", authMiddleware, createdByOrders);
orderRouter.post("/delete", authMiddleware, deleteOrder);





export default orderRouter;