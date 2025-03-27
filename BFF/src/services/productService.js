import logger from "../shared/loggerUtils.js";
import generalConstants from "../constants/generalConstants.js";
import { productServiceApiInstance } from "../api/apiInstances/apiInstance.js";
import SharedResponses from "../shared/sharedResponses.js";
import { HttpStatusCode } from "axios";

const createProduct = async (productData) => {
  try {
    const response = await productServiceApiInstance.request({
      url: "/products",
      method: generalConstants.HTTP_METHODS.POST,
      data: productData,
    });

    return response?.data;
  } catch (error) {
    logger.error(`An error occurred when creating a new product: ${error}`);
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.InternalServerError,
      error,
      "Failed to create product"
    );
  }
};

const getAllProducts = async (page = 0, size = 10) => {
  try {
    const params = { page, size };

    const response = await productServiceApiInstance.request({
      url: "/products",
      method: generalConstants.HTTP_METHODS.GET,
      params,
    });

    return response?.data;
  } catch (error) {
    logger.error(`An error occurred when fetching all products: ${error}`);
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.InternalServerError,
      error,
      "Failed to fetch products"
    );
  }
};

const getProductById = async (productId) => {
  try {
    const response = await productServiceApiInstance.request({
      url: `/products/${productId}`,
      method: generalConstants.HTTP_METHODS.GET,
    });

    return response?.data;
  } catch (error) {
    logger.error(
      `An error occurred when fetching product by ID: ${productId} | Error: ${
        error?.message || error
      }`
    );
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.NotFound,
      error,
      "Product not found"
    );
  }
};

const updateProduct = async (productId, productData) => {
  try {
    const response = await productServiceApiInstance.request({
      url: `/products/${productId}`,
      method: generalConstants.HTTP_METHODS.PUT,
      data: productData,
    });

    return response?.data;
  } catch (error) {
    logger.error(
      `An error occurred when updating product: ${productId} | Error: ${
        error?.message || error
      }`
    );
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.BadRequest,
      error,
      "Failed to update product"
    );
  }
};

const deleteProduct = async (productId) => {
  try {
    const response = await productServiceApiInstance.request({
      url: `/products/${productId}`,
      method: generalConstants.HTTP_METHODS.DELETE,
    });

    return response?.data;
  } catch (error) {
    logger.error(
      `An error occurred when deleting product: ${productId} | Error: ${
        error?.message || error
      }`
    );
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.InternalServerError,
      error,
      "Failed to delete product"
    );
  }
};

const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

export default ProductService;
