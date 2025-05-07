import express from "express";
import { getOrdersByUserId } from "../../controllers/v1/orderController.js";

const router = express.Router();

router.get("/order/user/:userId", getOrdersByUserId);

const orderRoutes = {
  router,
};
export default orderRoutes;
