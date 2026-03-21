import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentScreen = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [message, setMessage] = useState("");

 useEffect(() => {

  if (location.state?.order) {
    setOrder(location.state.order);
    localStorage.setItem("orderInfo", JSON.stringify(location.state.order));
    return;
  }

  const storedOrder = JSON.parse(localStorage.getItem("orderInfo"));

  if (storedOrder && storedOrder._id) {
    setOrder(storedOrder);
  } else {
    console.log("No order found");
    navigate("/products");
  }

}, [location, navigate]);

 const payHandler = async () => {

  if (!order) {
    alert("No order found");
    return;
  }

  try {

    // ✅ COD CASE
    if (paymentMethod === "COD") {

      setMessage("Order Placed Successfully (Cash on Delivery)");

      // delete cart items
      await Promise.all(
        order.items.map((item) =>
          axios.delete(`http://localhost:5000/api/cart/${item.cartItemId}`)
        )
      );

      localStorage.removeItem("orderInfo");
      localStorage.removeItem("selectedCartItems");

      setTimeout(() => {
        navigate("/products");
      }, 2000);

      return;
    }

    // ✅ ONLINE PAYMENT (UPI / CARD)
    const { data } = await axios.post(
      "http://localhost:5000/api/payments",
      {
        order: order._id,
        paymentMethod: paymentMethod,
        amount: order.totalAmount,
      }
    );

    setMessage(data.message || "Payment Successful");

    // delete cart items
    await Promise.all(
      order.items.map((item) =>
        axios.delete(`http://localhost:5000/api/cart/${item.cartItemId}`)
      )
    );

    localStorage.removeItem("orderInfo");
    localStorage.removeItem("selectedCartItems");

    setTimeout(() => {
      navigate("/products");
    }, 2000);

  } catch (error) {

    console.log("Payment error:", error.response?.data || error.message);
    alert("Payment failed");

  }
};

  if (!order) {
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        <h2>Loading Payment...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "380px",
          textAlign: "center",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >

        <h2 style={{ marginBottom: "20px" }}>💳 Payment</h2>

        <h3 style={{ marginBottom: "20px" }}>
          Amount: ₹ {order.totalAmount}
        </h3>

        <div style={{ textAlign: "left", marginBottom: "20px" }}>

          <label>
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>

          <br /><br />

          <label>
            <input
              type="radio"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI
          </label>

          <br /><br />

          <label>
            <input
              type="radio"
              value="Card"
              checked={paymentMethod === "Card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit / Debit Card
          </label>

        </div>

        <button
          onClick={payHandler}
          style={{
            padding: "12px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Pay Now
        </button>

        {message && (
          <p style={{ marginTop: "15px", color: "green", fontWeight: "bold" }}>
            {message} ✅
          </p>
        )}

      </div>
    </div>
  );
};

export default PaymentScreen;