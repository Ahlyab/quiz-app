import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            Quiz App
          </Link>
          <div className="space-x-4">
            <Link to="/" className="hover:text-indigo-200">
              Home
            </Link>
            <Link
              to="/create"
              className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100"
            >
              Create Quiz
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
