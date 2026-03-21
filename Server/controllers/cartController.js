const Cart = require("../models/Cart");

// ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const cartItem = await Cart.create(req.body);
    res.status(201).json({
      message: "Item added to cart",
      cartItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER CART
exports.getCart = async (req, res) => {
  try {
    const items = await Cart.find({ user: req.params.userId })
      .populate("product");
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE CART ITEM
exports.removeFromCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ INCREASE QUANTITY
exports.increaseQuantity = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    cartItem.quantity += 1;
    await cartItem.save();

    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DECREASE QUANTITY
exports.decreaseQuantity = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
      res.json(cartItem);
    } else {
      await Cart.findByIdAndDelete(req.params.id);
      res.json({ message: "Item removed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};