import React from "react";
import { Link, NavLink } from "react-router-dom";

const navItemClass =
  "rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-700";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-teal-100 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex max-w-8xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg  text-xs font-bold text-white">
            🌱
          </span>
          <span className="text-xl font-bold tracking-tight text-teal-700 sm:text-2xl">
            Krishi Mitra
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={navItemClass}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={navItemClass}>
            Dashboard
          </NavLink>
          <button className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-700">
            Contact
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;