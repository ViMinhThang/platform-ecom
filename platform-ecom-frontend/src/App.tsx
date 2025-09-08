import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./screens/Home";
import ProductDetail from "./screens/ProductDetails";
import Category from "./screens/Category";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:name" element={<ProductDetail />} />
        <Route path="/category/:name" element={<Category/>} />
      </Routes>
    </>
  );
}
