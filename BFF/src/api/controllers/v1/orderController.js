import orderService from "../../../services/orderService.js";

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderService.getOrderByUserId(userId);
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
