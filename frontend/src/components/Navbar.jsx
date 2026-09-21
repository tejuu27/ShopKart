import { useNavigate } from "react-router-dom";
import { logoutCustomer } from "../services/api";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutCustomer();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full bg-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        <h2
          onClick={() => navigate("/home")}
          className="text-xl font-semibold text-zinc-900 cursor-pointer"
        >
          🛍️ ShopKart
        </h2>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;