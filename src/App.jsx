import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import OtpPage from "./pages/OtpPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminCouponsPage from "./pages/AdminCouponsPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileInformationPage from "./pages/ProfileInformationPage";
import AddressesPage from "./pages/AddressesPage";
import OrdersPage from "./pages/OrdersPage";
import "./styles/App.css";
import CheckoutPage from "./pages/CheckoutPage";
import CatalogPage from "./pages/CatalogPage";

import AdminRoute from "./components/routes/AdminRoute";
import UserRoute from "./components/routes/UserRoute";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/cart" element={<CartPage />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/coupons" element={<AdminCouponsPage />} />
            </Route>

            <Route element={<UserRoute />}>
              <Route path="/profile" element={<ProfilePage />}>
                <Route index element={<Navigate to="info" replace />} />
                <Route path="info" element={<ProfileInformationPage />} />
                <Route path="addresses" element={<AddressesPage />} />
                <Route path="orders" element={<OrdersPage />} />
              </Route>
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
