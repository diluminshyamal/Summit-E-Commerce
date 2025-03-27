import { cartServiceApiInstance } from "../api/apiInstances/apiInstance.js"; // Import the axios instance
import SharedResponses from "../shared/sharedResponses.js";
import { HttpStatusCode } from "axios";

const createOrderService = async (userId, cartItemIds) => {
  try {
    const response = await cartServiceApiInstance.post("/orders", null, {
      params: { userId, cartItemIds },
    });
    return response.data;
  } catch (error) {
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.InternalServerError,
      error,
      "Failed to create order"
    );
  }
};

const getOrderByIdService = async (orderId) => {
  try {
    const response = await cartServiceApiInstance.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.NotFound,
      error,
      "Order not found"
    );
  }
};

const getOrdersByUserIdService = async (userId) => {
  try {
    const response = await cartServiceApiInstance.get(`/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.InternalServerError,
      error,
      "Failed to fetch orders for user"
    );
  }
};

const updateOrderService = async (orderId, orderDto) => {
  try {
    const response = await cartServiceApiInstance.put(
      `/orders/${orderId}`,
      orderDto
    );
    return response.data;
  } catch (error) {
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.BadRequest,
      error,
      "Failed to update order"
    );
  }
};

const deleteOrderService = async (orderId) => {
  try {
    await cartServiceApiInstance.delete(`/orders/${orderId}`);
  } catch (error) {
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.InternalServerError,
      error,
      "Failed to delete order"
    );
  }
};

const getAllOrdersService = async () => {
  try {
    const response = await cartServiceApiInstance.get("/orders");
    return response.data;
  } catch (error) {
    throw SharedResponses.ErrorResponse(
      HttpStatusCode.InternalServerError,
      error,
      "Failed to fetch all orders"
    );
  }
};

const orderService = {
  getAllOrdersService,
  deleteOrderService,
  updateOrderService,
  getOrdersByUserIdService,
  getOrderByIdService,
  createOrderService,
};

export default orderService;
