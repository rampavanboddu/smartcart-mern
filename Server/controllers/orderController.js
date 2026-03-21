const Order = require("../models/order");

// ✅ CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    console.log("Incoming Order Data:", req.body);

    const { user, items, totalAmount } = req.body;

    if (!user || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // ✅ Prevent duplicate orders within 5 seconds
    const recentOrder = await Order.findOne({
      user: user,
      totalAmount: totalAmount,
      createdAt: { $gte: new Date(Date.now() - 5000) }
    });

    if (recentOrder) {
      return res.status(200).json({
        message: "Order already created",
        order: recentOrder
      });
    }

    const order = await Order.create({
      user,
      items,
      totalAmount,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("ORDER ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// ✅ GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {

    const orders = await Order.find({ user: req.params.userId })
      .populate("items.product", "name price image");

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ ADMIN - GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price image");

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ CANCEL ORDER
exports.cancelOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    await order.deleteOne();

    res.json({
      message: "Order cancelled successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};