import express from "express";

import cartController from "../../controllers/v1/cartController.js";

const router = express.Router();

router.post("/cart", cartController.createCartIfNotExist);
router.get("/carts/:cartId/items", cartController.getCartByCartId);
router.put("/cart/:cartId/items", cartController.updateCart);
router.delete("/cart/:userId/:cartItemId", cartController.deleteCart);

const cartRoutes = {
  router,
};
export default cartRoutes;
