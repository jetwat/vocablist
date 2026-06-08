// components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg tracking-tight">
          VocabList
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Extract
            </Link>
            <Link
              to="/saved"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Saved
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-700"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
