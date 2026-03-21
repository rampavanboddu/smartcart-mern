import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) {
        navigate("/");
        return;
      }

      const { data } = await axios.get(
        `http://localhost:5000/api/orders/${userInfo._id}`
      );

      setOrders(data);
    };

    fetchOrders();
  }, [navigate, userInfo]);

  // ✅ Cancel Order Function
  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);

      alert("Order cancelled successfully");

      // remove order from UI
      setOrders((prev) => prev.filter((order) => order._id !== orderId));

    } catch (error) {
      console.log(error);
      alert("Failed to cancel order");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        background: "#f4f6f9",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/products")}
        style={{
          marginBottom: "20px",
          padding: "8px 15px",
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ⬅ Back to Products
      </button>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        📦 My Orders
      </h2>

      {orders.length === 0 && (
        <p style={{ textAlign: "center" }}>No orders found</p>
      )}

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            background: "#fff",
            margin: "15px auto",
            padding: "15px",
            maxWidth: "650px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          {/* Order Items */}
          {order.items?.map((item) => (
            <div
              key={item._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "15px",
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              {/* Product Image */}
              <img
                src={item.product?.image}
                alt={item.product?.name}
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  background: "#f0f0f0",
                  padding: "5px",
                }}
              />

              {/* Product Details */}
              <div>
                <h4 style={{ margin: "0 0 5px 0" }}>
                  {item.product?.name}
                </h4>
                <p style={{ margin: "4px 0" }}>
                  <b>Quantity:</b> {item.quantity}
                </p>
                <p style={{ margin: "4px 0" }}>
                  <b>Price:</b> ₹ {item.product?.price}
                </p>
                <p style={{ margin: "4px 0", color: "green" }}>
                  Free Delivery
                </p>
                <p style={{ margin: "4px 0" }}>
                  1 Year Warranty | 7 Days Replacement
                </p>
              </div>
            </div>
          ))}

          {/* Order Summary */}
          <p><b>Total Amount:</b> ₹ {order.totalAmount}</p>

          <p>
            <b>Status:</b>{" "}
            {order.isPaid ? "Paid ✅" : "Delivery in 2 days 🚚"}
          </p>

          {/* ✅ Cancel Button */}
          {!order.isPaid && (
            <button
              onClick={() => cancelOrder(order._id)}
              style={{
                marginTop: "10px",
                padding: "8px 15px",
                background: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel Order
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderScreen;