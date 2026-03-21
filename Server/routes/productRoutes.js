const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");

// ADD PRODUCT
router.post("/", addProduct);

// GET ALL PRODUCTS (with search & category filter)
router.get("/", getProducts);

// GET PRODUCT BY ID
router.get("/:id", getProductById);

module.exports = router;