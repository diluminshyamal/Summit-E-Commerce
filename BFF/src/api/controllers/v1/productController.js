import productService from "../../../services/productService.js";

const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    if (!productData.name || !productData.description || !productData.price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const createdProduct = await productService.createProduct(productData);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;

    const products = await productService.getAllProducts(page, size);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting all products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;

    const updatedProduct = await productService.updateProduct(
      productId,
      productData
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    await productService.deleteProduct(productId);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
