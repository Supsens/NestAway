import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto py-4 px-8">
        {/* Logo */}
        <Link to="/" className="cursor-pointer">
          <h1 className="font-bold text-sm sm:text-xl flex">
            <span className="text-slate-500">Nest</span>
            <span className="text-slate-800">Away</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form className="hidden sm:flex bg-slate-100 p-3 rounded-lg items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-32 sm:w-64"
          />
          <FaSearch className="text-slate-900" />
        </form>

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center gap-4 font-bold">
          <Link to="/">
            <li className="list-none hover:underline text-slate-700 hover:text-slate-950 cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="list-none hover:underline text-slate-700 hover:text-slate-950 cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/sign-in">
            <li className="list-none hover:underline text-slate-700 hover:text-slate-950 cursor-pointer">
              Sign in
            </li>
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <GiHamburgerMenu className="sm:hidden text-slate-800 cursor-pointer" onClick={toggleMenu} />

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 right-0 bg-slate-200 w-full flex flex-col items-center sm:hidden divide-y divide-slate-950">
            <Link to="/" className="py-2 hover:underline text-slate-700 hover:text-slate-950">
              Home
            </Link>
            <Link to="/about" className="py-2 hover:underline text-slate-700 hover:text-slate-950">
              About
            </Link>
            <Link to="/sign-in" className="py-2 hover:underline text-slate-700 hover:text-slate-950">
              Sign in
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
