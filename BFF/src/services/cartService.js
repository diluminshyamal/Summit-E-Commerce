import logger from "../shared/loggerUtils.js";
import generalConstants from "../constants/generalConstants.js";
import { productServiceApiInstance } from "../api/apiInstances/apiInstance.js";
import SharedResponses from "../shared/sharedResponses.js";

const getCartItemsByUserId = async (userId, res) => {
  try {
    const response = await productServiceApiInstance.request({
      url: `/carts/user/${userId}`,
      method: generalConstants.HTTP_METHODS.GET,
    });
    return response?.data;
  } catch (error) {
    logger.error(
      `Error fetching cart items for user ${userId}: ${error?.message || error}`
    );
    return SharedResponses.ErrorResponse(
      res,
      error?.response?.status,
      error,
      "Failed to fetch cart items."
    );
  }
};

const addItemToCart = async (userId, productData, res) => {
  try {
    const response = await productServiceApiInstance.request({
      url: `/carts/user/${userId}`,
      method: generalConstants.HTTP_METHODS.POST,
      data: productData,
    });
    return response?.data;
  } catch (error) {
    logger.error(
      `Error adding item to cart for user ${userId}: ${error?.message || error}`
    );
    return SharedResponses.ErrorResponse(
      res,
      error?.response?.status,
      error,
      "Failed to add item to cart."
    );
  }
};

const updateCartItem = async (userId, cartItemId, productData, res) => {
  try {
    const response = await productServiceApiInstance.request({
      url: `/carts/user/${userId}/${cartItemId}`,
      method: generalConstants.HTTP_METHODS.PUT,
      data: productData,
    });
    return response?.data;
  } catch (error) {
    logger.error(
      `Error updating cart item ${cartItemId} for user ${userId}: ${
        error?.message || error
      }`
    );
    return SharedResponses.ErrorResponse(
      res,
      error?.response?.status,
      error,
      "Failed to update cart item."
    );
  }
};

const deleteCartItem = async (userId, cartItemId, res) => {
  try {
    const response = await productServiceApiInstance.request({
      url: `/carts/user/${userId}/${cartItemId}`,
      method: generalConstants.HTTP_METHODS.DELETE,
    });
    return response?.data;
  } catch (error) {
    logger.error(
      `Error deleting cart item ${cartItemId} for user ${userId}: ${
        error?.message || error
      }`
    );
    return SharedResponses.ErrorResponse(
      res,
      error?.response?.status,
      error,
      "Failed to delete cart item."
    );
  }
};

const clearCart = async (userId, res) => {
  try {
    const response = await productServiceApiInstance.request({
      url: `/carts/user/${userId}/clear`,
      method: generalConstants.HTTP_METHODS.DELETE,
    });
    return response?.data;
  } catch (error) {
    logger.error(
      `Error clearing cart for user ${userId}: ${error?.message || error}`
    );
    return SharedResponses.ErrorResponse(
      res,
      error?.response?.status,
      error,
      "Failed to clear cart."
    );
  }
};

const CartService = {
  getCartItemsByUserId,
  addItemToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
};

export default CartService;
