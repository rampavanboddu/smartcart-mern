const Payment = require("../models/Payment");

exports.createPayment = async (req, res) => {
  try {
    const { order, paymentMethod, amount } = req.body;

    const payment = await Payment.create({
      order,
      paymentMethod,
      amount,
    });

    res.status(201).json({
      message: "Payment successful",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};