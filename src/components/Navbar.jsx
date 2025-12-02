import React, { useState } from "react";
import { IoMenu, IoClose, IoCartOutline, IoHeartOutline, IoPersonOutline, IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useCart, useAuth } from "../Context/CartContext.jsx";
import { toast } from "react-toastify";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { currentUser, logout, getWishlistCount } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
     logout();
     navigate('/login');
  
      toast.success('Logged out successfully');
   
    setOpen(false);
  };

  return (
    <nav className="bg-[#1e293b] text-white fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <p className="text-2xl font-extrabold text-blue-400">Hygiene</p>
          <p className="text-2xl font-extrabold text-green-400">Hub.</p>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-lg font-medium">

          <li><Link className="hover:text-green-400" to="/">Home</Link></li>

          <li><Link className="hover:text-green-400" to="/products">Products</Link></li>

          <li className="flex items-center gap-1 hover:text-green-400 relative">
            <IoCartOutline size={20} />
            <Link to="/cart">Cart</Link>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </li>

          <li className="flex items-center gap-1 hover:text-green-400 relative">
            <IoHeartOutline size={20} />
            <Link to="/wishlist">Wishlist</Link>
            {getWishlistCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getWishlistCount()}
              </span>
            )}
          </li>

          {currentUser ? (
            <li className="flex items-center gap-1 hover:text-green-400">
              <IoPersonOutline size={20} />
              <Link to="/">{currentUser.username}</Link>
            </li>
          ) : (
            <li className="flex items-center gap-1 hover:text-green-400">
              <IoPersonOutline size={20} />
              <Link to="/login">Login</Link>
            </li>
          )}

        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
            >
              <IoLogOutOutline size={18} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-3xl text-white" onClick={() => setOpen(!open)}>
          {open ? <IoClose /> : <IoMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#1e293b] text-white shadow-lg p-6 space-y-5 text-lg font-medium">

          <Link onClick={() => setOpen(false)} to="/" className="block hover:text-green-400">Home</Link>

          <Link onClick={() => setOpen(false)} to="/products" className="block hover:text-green-400">Products</Link>

          <Link onClick={() => setOpen(false)} to="/cart" className="flex items-center gap-2 hover:text-green-400 relative">
            <IoCartOutline size={22} /> Cart
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>

          <Link onClick={() => setOpen(false)} to="/wishlist" className="flex items-center gap-2 hover:text-green-400 relative">
            <IoHeartOutline size={22} /> Wishlist
            {getWishlistCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getWishlistCount()}
              </span>
            )}
          </Link>

          {currentUser ? (
            <>
              <Link onClick={() => setOpen(false)} to="/" className="flex items-center gap-2 hover:text-green-400">
                <IoPersonOutline size={22} /> {currentUser.username}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white text-center py-2 rounded-md hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <IoLogOutOutline size={20} />
                Logout
              </button>
            </>
          ) : (
            <Link
              onClick={() => setOpen(false)}
              to="/login"
              className="block bg-green-500 text-white text-center py-2 rounded-md hover:bg-green-600"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;