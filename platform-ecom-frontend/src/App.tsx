import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./screens/Home";
import ProductDetail from "./screens/ProductDetails";
import Category from "./screens/admin/Category";
import Layout from "./components/admin-layout";
import Dashboard from "./screens/admin/Dashboard";
import Order from "./screens/admin/Order";
import Coupon from "./screens/admin/Coupon";
import User from "./screens/admin/User";
import Products from "./screens/admin/products/Products";
import ProductDetailAdmin from "./screens/admin/products/ProductDetail";
export default function App() {
  const location = useLocation();

  const showHeader = !location.pathname.startsWith("/admin");

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:name" element={<ProductDetail />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/admin" element={<Layout />}>
          <Route path="dashboard" index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:productName" element={<ProductDetailAdmin />} />
          <Route path="orders" element={<Order />} />
          <Route path="users" element={<User />} />
          <Route path="coupons" element={<Coupon />} />
          <Route path="categories" element={<Category />} />
        </Route>
      </Routes>
    </>
  );
}
