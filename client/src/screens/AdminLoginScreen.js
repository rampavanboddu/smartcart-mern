import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLoginScreen = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginHandler = () => {

    // ✅ FAKE LOGIN (no backend)
    if (email === "admin@gmail.com" && password === "123456") {

      const adminData = {
        email: email,
        isAdmin: true
      };

      localStorage.setItem("adminInfo", JSON.stringify(adminData));

      navigate("/admin");

    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Admin Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={loginHandler}>Login</button>
    </div>
  );
};

export default AdminLoginScreen;