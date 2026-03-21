const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Paid",
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);