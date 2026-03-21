const express = require("express");
const router = express.Router();

const {
  createOrder,
  cancelOrder,
  getAllOrders,
  getUserOrders
} = require("../controllers/orderController");

// ✅ CREATE ORDER
router.post("/", createOrder);

// ✅ ADMIN - GET ALL ORDERS
router.get("/", getAllOrders);

// ✅ USER - GET HIS ORDERS
router.get("/:userId", getUserOrders);

// ✅ CANCEL ORDER
router.delete("/:id", cancelOrder);

module.exports = router;