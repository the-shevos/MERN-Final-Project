import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/Register";
import AuthPage from "./page/AuthPage";
import Dashboard from "./page/Dashboard";
import SupportPage from "./page/SupportPage";
import DashboardHome from "./page/DashboardHome";
import Members from "./page/Members";
import ProductPage from "./page/ProductPage";
import OrdersPage from "./page/OrdersPage";
import UserProductPage from "./page/Product";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/product" element={<UserProductPage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="/dashboard/products" element={<ProductPage />} />
          <Route path="members" element={<Members />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
