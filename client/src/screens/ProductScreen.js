import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState("");

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const addToCartHandler = async (productId) => {
    if (!userInfo) {
      alert("Please login");
      navigate("/");
      return;
    }

    await axios.post("http://localhost:5000/api/cart", {
      user: userInfo._id,
      product: productId,
      quantity: 1,
    });

    alert("Item Added To Cart");
  };

  const buyNowHandler = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div style={{ padding: "20px", background: "#f4f6f9", minHeight: "100vh" }}>

      {/* Top Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>🛒 Products</h2>

        <div>
          <button onClick={() => navigate("/cart")} style={navBtnStyle}>
            View Cart
          </button>

          <button onClick={() => navigate("/orders")} style={navBtnStyle}>
            View Orders
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("userInfo");
              navigate("/");
            }}
            style={{ ...navBtnStyle, background: "#dc3545" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search + Price */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name, brand or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
            marginRight: "10px",
          }}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{
            padding: "10px",
            width: "150px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {products
          .filter((p) => {
            return (
              (p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.brand.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())) &&
              (price === "" || p.price <= Number(price))
            );
          })
          .map((p) => (
            <div
              key={p._id}
              style={{
                background: "#fff",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                textAlign: "center",
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />

              <h3
                style={{ cursor: "pointer", color: "#007bff" }}
                onClick={() => navigate(`/product/${p._id}`)}
              >
                {p.name}
              </h3>

              <p>
                <b>Brand:</b> {p.brand}
              </p>

              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "green",
                }}
              >
                ₹ {p.price}
              </p>

              <button
                onClick={() => addToCartHandler(p._id)}
                disabled={p.countInStock === 0}
                style={{
                  padding: "10px",
                  width: "100%",
                  background: p.countInStock === 0 ? "gray" : "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: p.countInStock === 0 ? "not-allowed" : "pointer",
                  marginBottom: "8px",
                }}
              >
                {p.countInStock === 0 ? "Out Of Stock" : "Add To Cart"}
              </button>

              <button
                onClick={() => buyNowHandler(p._id)}
                style={{
                  padding: "10px",
                  width: "100%",
                  background: "#ff9900",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Buy Now
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

const navBtnStyle = {
  padding: "8px 12px",
  marginLeft: "10px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default ProductScreen;