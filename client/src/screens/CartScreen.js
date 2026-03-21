import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartScreen = () => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchCart = async () => {
      if (!userInfo) {
        navigate("/");
        return;
      }

      const { data } = await axios.get(
        `http://localhost:5000/api/cart/${userInfo._id}`
      );

      setCart(data);
    };

    fetchCart();
  }, [navigate, userInfo]);

  const handleSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Quantity Increase
  const increaseQty = async (itemId) => {
    await axios.put(`http://localhost:5000/api/cart/increase/${itemId}`);
    refreshCart();
  };

  // Quantity Decrease
  const decreaseQty = async (itemId) => {
    await axios.put(`http://localhost:5000/api/cart/decrease/${itemId}`);
    refreshCart();
  };

  const refreshCart = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/cart/${userInfo._id}`
    );
    setCart(data);
  };

  const total = cart
    .filter((item) => selectedItems.includes(item._id))
    .reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const proceedToCheckout = () => {
    const selectedCartItems = cart.filter((item) =>
      selectedItems.includes(item._id)
    );

    localStorage.setItem(
      "selectedCartItems",
      JSON.stringify(selectedCartItems)
    );

    navigate("/checkout");
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
        🛍 My Cart
      </h2>

      {cart.length === 0 && (
        <p style={{ textAlign: "center" }}>Cart is empty</p>
      )}

      {cart.map((item) => (
        <div
          key={item._id}
          style={{
            background: "#fff",
            margin: "15px auto",
            padding: "15px",
            maxWidth: "650px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <input
            type="checkbox"
            checked={selectedItems.includes(item._id)}
            onChange={() => handleSelect(item._id)}
          />

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

          <div style={{ flex: 1 }}>
            <h4>{item.product?.name}</h4>
            <p><b>Price:</b> ₹ {item.product?.price}</p>

            {/* Quantity Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => decreaseQty(item._id)}
                style={{
                  padding: "5px 10px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => increaseQty(item._id)}
                style={{
                  padding: "5px 10px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>

            <p style={{ color: "green" }}>Free Delivery</p>
            <p>1 Year Warranty | 7 Days Replacement</p>
          </div>
        </div>
      ))}

      {selectedItems.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>Total: ₹ {total}</h3>

          <button
            onClick={proceedToCheckout}
            style={{
              padding: "12px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Proceed With Selected Items
          </button>
        </div>
      )}
    </div>
  );
};

export default CartScreen;