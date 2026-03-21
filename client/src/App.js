import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginScreen from "./screens/LoginScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import PlaceorderScreen from "./screens/PlaceorderScreen";
import PaymentScreen from "./screens/PaymentScreen";
import OrderScreen from "./screens/OrderScreen";
import AdminScreen from "./screens/AdminScreen";
import ProductDetailsScreen from "./screens/ProductDetailsScreen";
import AdminLoginScreen from "./screens/AdminLoginScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/products" element={<ProductScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/checkout" element={<PlaceorderScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/orders" element={<OrderScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/product/:id" element={<ProductDetailsScreen />} />
        <Route path="/admin/login" element={<AdminLoginScreen />} />
      </Routes>
    </Router>
  );
}

export default App;