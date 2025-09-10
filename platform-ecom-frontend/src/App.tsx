import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./screens/Home";
import ProductDetail from "./screens/ProductDetails";
import Layout from "./components/admin-layout";
import Dashboard from "./screens/admin/Dashboard";
import Order from "./screens/admin/Order";
import Coupon from "./screens/admin/Coupon";
import Products from "./screens/admin/products/Products";
import ProductDetailAdmin from "./screens/admin/products/ProductDetail";
import { ToastContainer } from "react-toastify";
import Category from "./screens/Category";
import UsersAdmin from "./screens/admin/users/Users";
import CategoriesAdmin from "./screens/admin/categories/categories";
import UserDetailAdmin from "./screens/admin/users/UserDetails";
import Login from "./screens/Login";
import Register from "./screens/Register";
import ProtectedRoute from "./screens/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

export default function App() {
  const location = useLocation();

  const showHeader = !location.pathname.startsWith("/admin");

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products/:name" element={<ProductDetail />} />
        <Route path="/category/:name" element={<Category />} />
        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="create-account" element={<Register />} />
        </Route>

        {/* Admin routes (chỉ cho ROLE_ADMIN) */}
        <Route element={<ProtectedRoute roles={["ROLE_ADMIN"]} />}>
          <Route path="/admin" element={<Layout />}>
            <Route path="dashboard" index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route
              path="products/:productName"
              element={<ProductDetailAdmin />}
            />
            <Route path="users/:userId" element={<UserDetailAdmin />} />
            <Route path="orders" element={<Order />} />
            <Route path="users" element={<UsersAdmin />} />
            <Route path="coupons" element={<Coupon />} />
            <Route path="categories" element={<CategoriesAdmin />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
      />
    </>
  );
}
