import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CheckoutScreen() {

  const [cart, setCart] = useState([]);
  const [placingOrder, setPlacingOrder] = useState(false);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {

    if (!userInfo) {
      navigate("/");
      return;
    }

    const selected = JSON.parse(localStorage.getItem("selectedCartItems"));

    if (!selected || selected.length === 0) {
      navigate("/cart");
      return;
    }

    setCart(selected);

  }, [navigate, userInfo]);

  const total = cart.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  const placeOrder = async () => {

    if (placingOrder) return;

    try {

      setPlacingOrder(true);

      const orderData = {
        user: userInfo._id,
        items: cart.map((item) => ({
          product: item.product?._id || item.product,
          quantity: item.quantity,
          price: item.product?.price || item.price,
          cartItemId: item._id,
        })),
        totalAmount: total,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        orderData
      );

      const order = data.order || data;

      localStorage.setItem("orderInfo", JSON.stringify(order));

      navigate("/payment", { state: { order } });

    } catch (error) {

      console.log("Order error:", error);
      alert("Failed to place order");
      setPlacingOrder(false);

    }
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh", background: "#f4f6f9" }}>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🧾 Order Summary
      </h2>

      {cart.map((item) => (
        <div
          key={item._id}
          style={{
            background: "#fff",
            margin: "10px auto",
            padding: "15px",
            maxWidth: "500px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3>{item.product?.name || "Product"}</h3>
          <p><b>Quantity:</b> {item.quantity}</p>
          <p><b>Price:</b> ₹ {item.product?.price || item.price || 0}</p>
        </div>
      ))}

      {cart.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>Total Amount: ₹ {total}</h3>

          <button
            onClick={placeOrder}
            disabled={placingOrder}
            style={{
              marginTop: "10px",
              padding: "12px 20px",
              background: placingOrder ? "gray" : "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: placingOrder ? "not-allowed" : "pointer",
            }}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      )}

    </div>
  );
}

export default CheckoutScreen;