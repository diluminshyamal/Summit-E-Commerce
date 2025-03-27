import orderService from "../../../services/orderService.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, cartItemIds } = req.query;
    const createdOrder = await orderService.createOrderService(
      userId,
      cartItemIds
    );
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to create order",
      details: error.response?.data?.details,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderByIdService(orderId);
    res.json(order);
  } catch (error) {
    console.error("Error getting order by ID:", error);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message || error.message || "Failed to get order",
      details: error.response?.data?.details,
    });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderService.getOrdersByUserIdService(userId);
    res.json(orders);
  } catch (error) {
    console.error("Error getting orders by user ID:", error);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to get orders",
      details: error.response?.data?.details,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderDto = req.body;
    const updatedOrder = await orderService.updateOrderService(
      orderId,
      orderDto
    );
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to update order",
      details: error.response?.data?.details,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await orderService.deleteOrderService(orderId);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to delete order",
      details: error.response?.data?.details,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrdersService();
    res.json(orders);
  } catch (error) {
    console.error("Error getting all orders:", error);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to get all orders",
      details: error.response?.data?.details,
    });
  }
};
