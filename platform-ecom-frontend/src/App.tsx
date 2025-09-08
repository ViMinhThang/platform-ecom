import { Routes, Route } from "react-router-dom";
import Products from "./components/Products";
import ProductDetail from "./screens/ProductDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/products" element={<Products />} />
      <Route path="/products/:name" element={<ProductDetail />} />
    </Routes>
  );
}
