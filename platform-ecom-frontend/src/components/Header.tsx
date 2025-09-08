import { FaSearch, FaShopify, FaShoppingBag, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 w-full mx-auto border-b border-slate-300 pb-5">
      <div className="flex justify-center items-center gap-5 ml-[20px]">
        <Link to="/">
          <h1 className="font-bold text-2xl">E-Commerce</h1>
        </Link>
        <h1 className="text-xl">About us</h1>
      </div>
      <FaShopify size={48} />
      <div className="flex justify-center items-center gap-4 mr-[20px]">
        <FaSearch size={24} className="text-black cursor-pointer" />
        <FaShoppingBag size={24} className="text-black cursor-pointer" />
        <FaUser size={24} className="text-black cursor-pointer" />
      </div>
    </div>
  );
};

export default Header;
