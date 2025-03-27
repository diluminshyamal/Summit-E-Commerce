import CartService from "../../../services/cartService.js";

export const getCartItemsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await CartService.getCartItemsByUserId(userId);
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch cart items",
      details: error.response?.data?.details,
    });
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const productData = req.body;
    const addedItem = await CartService.addItemToCart(userId, productData);
    res.status(201).json(addedItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to add item to cart",
      details: error.response?.data?.details,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { userId, cartItemId } = req.params;
    const productData = req.body;
    const updatedItem = await CartService.updateCartItem(
      userId,
      cartItemId,
      productData
    );
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to update cart item",
      details: error.response?.data?.details,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { userId, cartItemId } = req.params;
    await CartService.deleteCartItem(userId, cartItemId);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to delete cart item",
      details: error.response?.data?.details,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await CartService.clearCart(userId);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(error.response?.status || 500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to clear cart",
      details: error.response?.data?.details,
    });
  }
};
