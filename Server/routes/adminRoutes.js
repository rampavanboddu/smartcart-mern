const express = require("express");
const router = express.Router();
const {
  getUsers,
  getProducts,
  getOrders,
} = require("../controllers/adminController");

router.get("/users", getUsers);
router.get("/products", getProducts);
router.get("/orders", getOrders);

module.exports = router;