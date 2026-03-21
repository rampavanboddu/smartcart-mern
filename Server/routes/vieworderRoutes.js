const express = require("express");
const router = express.Router();
const Orders = require("../models/order");
const { createOrder } = require("../controllers/orderController");

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const { user, items, totalAmount } = req.body;

    const order = new Order({
      user,
      items,
      totalAmount,
    });

    const createdOrder = await order.save();

    res.status(201).json({ order: createdOrder });
  } catch (error) {
    res.status(500).json({ message: "Order creation failed" });
  }
});

// GET USER ORDERS
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("items.product");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;