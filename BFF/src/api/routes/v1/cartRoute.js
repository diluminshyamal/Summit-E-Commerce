import express from "express";

import {
  getCartItemsByUserId,
  addItemToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../../controllers/v1/cartController.js";

const router = express.Router();

router.get("/cart/:userId", getCartItemsByUserId);
router.post("/cart/:userId", addItemToCart);
router.put("/cart/:userId/:cartItemId", updateCartItem);
router.delete("/cart/:userId/:cartItemId", deleteCartItem);
router.delete("/cart/:userId/clear", clearCart);

const cartRoutes = {
  router,
};
export default cartRoutes;
