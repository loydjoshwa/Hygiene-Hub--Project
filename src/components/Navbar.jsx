import React, { useState } from "react";
import { IoMenu, IoClose, IoCartOutline, IoHeartOutline, IoPersonOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

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

          <li className="flex items-center gap-1 hover:text-green-400">
            <IoCartOutline size={20} />
            <Link to="/cart">Cart</Link>
          </li>

          <li className="flex items-center gap-1 hover:text-green-400">
            <IoHeartOutline size={20} />
            <Link to="/wishlist">Wishlist</Link>
          </li>

          <li className="flex items-center gap-1 hover:text-green-400">
            <IoPersonOutline size={20} />
            <Link to="/profile">Profile</Link>
          </li>

        </ul>

        {/* Login Button (Desktop) */}
        <Link
          to="/login"
          className="hidden md:block bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Login
        </Link>

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

          <Link onClick={() => setOpen(false)} to="/cart" className="flex items-center gap-2 hover:text-green-400">
            <IoCartOutline size={22} /> Cart
          </Link>

          <Link onClick={() => setOpen(false)} to="/wishlist" className="flex items-center gap-2 hover:text-green-400">
            <IoHeartOutline size={22} /> Wishlist
          </Link>

          <Link onClick={() => setOpen(false)} to="/profile" className="flex items-center gap-2 hover:text-green-400">
            <IoPersonOutline size={22} /> Profile
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/login"
            className="block bg-green-500 text-white text-center py-2 rounded-md hover:bg-green-600"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
