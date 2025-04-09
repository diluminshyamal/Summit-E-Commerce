import cartService from "../../../services/cartService.js";

const createCartIfNotExist = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing required user ID" });
    }

    const cartItems = await cartService.getCartByUserId(userId);
    if (
      cartItems === null ||
      cartItems?.status === "NOT_FOUND" ||
      cartItems?.message === "Cart not found"
    ) {
      const newCart = await cartService.createCart(userId);
      return res.status(201).json(newCart);
    }

    res.status(200).json({ message: "Cart already exists", cart: cartItems });
  } catch (error) {
    console.error("Error checking/creating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCartByCartId = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await cartService.getCartByCartId(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error getting cart by user ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cartData = req.body;
    const updatedCart = await cartService.updateCart(cartId, cartData);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    await cartService.deleteCart(userId);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createCartIfNotExist,
  getCartByCartId,
  updateCart,
  deleteCart,
};
