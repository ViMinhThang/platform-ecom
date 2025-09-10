import { Link } from "react-router-dom";
import { LucideShoppingCart, Search, ShoppingBag, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center p-4 w-full mx-auto border-b border-slate-300 pb-5">
      <div className="flex justify-center items-center gap-5 ml-[20px]">
        <Link to="/">
          <h1 className="font-bold text-2xl">E-Commerce</h1>
        </Link>
        <h1 className="text-xl">About us</h1>
      </div>

      <LucideShoppingCart size={48} />

      <div className="flex justify-center items-center gap-4 mr-[20px]">
        <Search size={24} className="text-black cursor-pointer" />
        <ShoppingBag size={24} className="text-black cursor-pointer" />

        {/* 👇 Check user */}
        <Link to={user ? "/user" : "/login"}>
          <User size={24} className="text-black cursor-pointer" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
