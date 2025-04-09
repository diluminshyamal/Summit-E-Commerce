import logger from "../shared/loggerUtils.js";
import generalConstants from "../constants/generalConstants.js";
import { cartServiceApiInstance } from "../api/apiInstances/apiInstance.js";
import SharedResponses from "../shared/sharedResponses.js";
import { HttpStatusCode } from "axios";

const getCartByCartId = async (cartId) => {
  try {
    const response = await cartServiceApiInstance.request({
      url: `/carts/${cartId}/items`,
      method: generalConstants.HTTP_METHODS.GET,
    });

    return response?.data;
  } catch (error) {
    if (error.response?.status === 404) {
      logger.warn(`Cart not found for cart ${cartId}`);
      return null; // Return null instead of throwing an error
    }
    logger.error(`Error fetching cart for cart ${cartId}: ${error}`);
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.InternalServerError,
      error,
      "Failed to fetch cart"
    );
  }
};

const getCartByUserId = async (userId) => {
  try {
    const response = await cartServiceApiInstance.request({
      url: `/carts/user/${userId}`,
      method: generalConstants.HTTP_METHODS.GET,
    });

    return response?.data;
  } catch (error) {
    if (error.response?.status === 404) {
      logger.warn(`Cart not found for user ${userId}`);
      return null; // Return null instead of throwing an error
    }
    logger.error(`Error fetching cart for cart ${userId}: ${error}`);
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.InternalServerError,
      error,
      "Failed to fetch cart"
    );
  }
};

const createCart = async (userId) => {
  try {
    const response = await cartServiceApiInstance.request({
      url: "/carts/",
      method: generalConstants.HTTP_METHODS.POST,
      data: {
        userId,
        cartItems: [],
      },
    });

    return response?.data;
  } catch (error) {
    // If 404 occurs, log it and return a more meaningful response
    if (error.response?.status === 404) {
      logger.warn(
        `Cart creation endpoint not found: ${error?.message || error}`
      );
      throw SharedResponses.ErrorResponse(
        HttpStatusCode.NotFound,
        error,
        "Cart creation endpoint not found"
      );
    }

    // For other errors, log the error and return internal server error response
    logger.error(`Error creating cart: ${error?.message || error}`);
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.InternalServerError,
      error,
      "Failed to create cart"
    );
  }
};

const updateCart = async (cartId, cartData) => {
  try {
    const response = await cartServiceApiInstance.request({
      url: `/carts/${cartId}/items`,
      method: generalConstants.HTTP_METHODS.POST,
      data: cartData,
    });

    return response?.data;
  } catch (error) {
    logger.error(
      `Error updating cart for user ${userId}: ${error?.message || error}`
    );
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.BadRequest,
      error,
      "Failed to update cart"
    );
  }
};

const deleteCart = async (userId) => {
  try {
    const response = await cartServiceApiInstance.request({
      url: `/carts/user/${userId}`,
      method: generalConstants.HTTP_METHODS.DELETE,
    });

    return response?.data;
  } catch (error) {
    logger.error(
      `Error deleting cart for user ${userId}: ${error?.message || error}`
    );
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.InternalServerError,
      error,
      "Failed to delete cart"
    );
  }
};

const CartService = {
  getCartByCartId,
  createCart,
  updateCart,
  deleteCart,
  getCartByUserId,
};

export default CartService;
