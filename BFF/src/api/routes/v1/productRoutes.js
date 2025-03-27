import express from "express";
import productController from "../../controllers/v1/productController.js";

const router = express.Router();

router.post("/product/", productController.createProduct);
router.put("/product/:id", productController.updateProduct);
router.get("/product/", productController.getAllProducts);
router.get("/product/:id", productController.getProductById);
router.delete("/product/:id", productController.deleteProduct);

const productRoutes = {
  router,
};
export default productRoutes;
