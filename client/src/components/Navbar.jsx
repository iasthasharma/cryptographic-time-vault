import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-white/10 backdrop-blur-lg border-b border-white/10 px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-white tracking-tight"
        >
          Vaultix
        </Link>

        {/* Nav Links */}
        <div className="flex gap-6 items-center">
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition"
          >
            Home
          </Link>

          <Link
            to="/auth"
            className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-2xl shadow-lg transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;