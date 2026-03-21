import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetailsScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = async () => {
    if (!userInfo) {
      alert("Please login");
      navigate("/");
      return;
    }

    await axios.post("http://localhost:5000/api/cart", {
      user: userInfo._id,
      product: product._id,
      quantity: 1,
    });

    alert("Item Added To Cart");
  };

  const buyNowHandler = async () => {
    if (!userInfo) {
      alert("Please login");
      navigate("/");
      return;
    }

    await axios.post("http://localhost:5000/api/cart", {
      user: userInfo._id,
      product: product._id,
      quantity: 1,
    });

    navigate("/cart");
  };

  return (
    <div style={{ padding: "40px", background: "#f4f6f9", minHeight: "100vh" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        🔙 Back
      </button>

      <div
        style={{
          display: "flex",
          gap: "40px",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "350px",
            height: "350px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />

        <div>
          <h2>{product.name}</h2>

          <p><b>Brand:</b> {product.brand}</p>
          <p><b>Category:</b> {product.category}</p>
          <p><b>Description:</b> {product.description}</p>
          <p><b>Stock:</b> {product.countInStock}</p>

          <h3 style={{ color: "green" }}>₹ {product.price}</h3>

          {/* Delivery Section */}
          <div style={{
            marginTop: "15px",
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "8px"
          }}>
            <p>🚚 Free Delivery</p>
            <p>🛡 1 Year Warranty</p>
            <p>🔄 7 Days Replacement</p>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
            <button
              onClick={addToCartHandler}
              style={{
                padding: "10px 20px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add To Cart
            </button>

            <button
              onClick={buyNowHandler}
              style={{
                padding: "10px 20px",
                background: "#ff9900",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsScreen;