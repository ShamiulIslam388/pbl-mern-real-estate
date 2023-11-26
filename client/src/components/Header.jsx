import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-slate-700 w-full">
      <div className="max-w-6xl mx-auto p-4 flex justify-between items-center space-x-4">
        <div>
          <Link to="/" className="text-white sm:text-2xl font-bold">
            <span className="text-orange-500">Sham</span>Estate
          </Link>
        </div>

        <form className="flex items-center bg-white py-2 px-4 gap-2.5 rounded-sm">
          <input
            type="text"
            placeholder="Search..."
            className="w-24 sm:w-64 focus:outline-none"
          />
          <FiSearch />
        </form>

        <div className="flex space-x-4 text-white font-semibold">
          <Link to="/" className="hidden sm:block hover:underline">
            Home
          </Link>
          <Link to="/about" className="hidden sm:block hover:underline">
            About
          </Link>
          {currentUser ? (
            <Link to="/profile">
              <img
                className="rounded-full h-7 w-7"
                src={currentUser.avatar}
                alt={currentUser.username}
              />
            </Link>
          ) : (
            <Link
              to="/sign-in"
              className="text-white whitespace-nowrap hover:underline"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
