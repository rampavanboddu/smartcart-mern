import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminScreen = () => {

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

    if (!adminInfo || !adminInfo.isAdmin) {
      alert("Access Denied");
      navigate("/admin/login");
      return;
    }

    fetchAll();

  }, [navigate]);

  const fetchAll = async () => {
    try {

      const usersData = await axios.get("http://localhost:5000/api/admin/users");
      const productsData = await axios.get("http://localhost:5000/api/products");
      const ordersData = await axios.get("http://localhost:5000/api/orders");

      setUsers(usersData.data);
      setProducts(productsData.data);
      setOrders(ordersData.data);

    } catch (error) {
      console.log(error);
    }
  };

  // ✅ DELETE ORDER
  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`);
      fetchAll();
    } catch (error) {
      console.log(error);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("adminInfo");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px", background: "#f4f6f9", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>⚙️ Admin Panel</h1>

        <button
          onClick={logoutHandler}
          style={{
            background: "red",
            color: "white",
            padding: "8px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Logout
        </button>
      </div>

      {/* USERS */}
      <h2>👤 Users ({users.length})</h2>
      {users.map((u) => (
        <div key={u._id} style={cardStyle}>
          {u.name} - {u.email}
        </div>
      ))}

      {/* PRODUCTS */}
      <h2>📦 Products ({products.length})</h2>
      {products.map((p) => (
        <div key={p._id} style={cardStyle}>
          {p.name} - ₹ {p.price}
        </div>
      ))}

      {/* ORDERS */}
      <h2>🧾 Orders ({orders.length})</h2>
      {orders.map((o) => (
        <div key={o._id} style={cardStyle}>
          <p><b>Order ID:</b> {o._id}</p>
          <p><b>Total:</b> ₹ {o.totalAmount}</p>
          <p><b>User:</b> {o.user?.name || "N/A"}</p>

          <h4>Items:</h4>
          {o.items.map((item) => (
            <div key={item._id}>
              {item.product?.name} × {item.quantity}
            </div>
          ))}

          {/* DELETE BUTTON */}
          <button
            onClick={() => deleteOrder(o._id)}
            style={{
              background: "red",
              color: "white",
              padding: "5px 10px",
              border: "none",
              borderRadius: "5px",
              marginTop: "10px"
            }}
          >
            Delete Order
          </button>
        </div>
      ))}

    </div>
  );
};

const cardStyle = {
  background: "#fff",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "8px",
  boxShadow: "0 0 5px rgba(0,0,0,0.1)",
};

export default AdminScreen;