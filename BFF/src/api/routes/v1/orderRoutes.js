import express from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  deleteOrder,
  getAllOrders,
} from "../../controllers/v1/orderController.js";

const router = express.Router();

router.post("/order", createOrder);
router.get("/order/:orderId", getOrderById);
router.get("/order/:userId", getOrdersByUserId);
router.put("/order/:orderId", updateOrder);
router.delete("/order/:orderId", deleteOrder);
router.get("/order", getAllOrders);

const orderRoutes = {
  router,
};
export default orderRoutes;
