import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav className="p-5 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-green-700">🌱 Krishi Mitra</h1>

        <ul className="flex gap-6 text-green-800 font-medium mt-2">
          <li className="hover:text-green-600 cursor-pointer">
            <Link to="/">Home</Link>
          </li>

          <li className="hover:text-green-600 cursor-pointer">Contact</li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
