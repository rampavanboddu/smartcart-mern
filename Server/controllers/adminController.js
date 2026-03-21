const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/order");

// USERS
exports.getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// PRODUCTS
exports.getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// ORDERS
exports.getOrders = async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
};