const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} = require("../controllers/cartController");

// ADD ITEM
router.post("/", addToCart);

// GET USER CART
router.get("/:userId", getCart);

// DELETE ITEM
router.delete("/:id", removeFromCart);

// INCREASE QUANTITY
router.put("/increase/:id", increaseQuantity);

// DECREASE QUANTITY
router.put("/decrease/:id", decreaseQuantity);

module.exports = router;