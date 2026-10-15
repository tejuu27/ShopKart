
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutCustomer } from "../services/api";
import { CartContext } from "../context/CartContext.jsx";

function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const getNavClass = ({ isActive }) =>
    `hidden sm:block px-4 py-2 rounded-xl text-sm font-medium transition ${
      isActive
        ? "bg-[#2b2b2b] text-white"
        : "text-[#6b6258] hover:text-[#2b2b2b] hover:bg-[#e5ded3]"
    }`;

  const handleLogout = async () => {
    try {
      await logoutCustomer();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full bg-[#f8f4ee] border-b border-[#d1c7ba]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-xl font-semibold text-[#2b2b2b] hover:opacity-75 transition"
        >
          <span className="text-xl">🛍️</span>
          <span>ShopKart</span>
        </button>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <NavLink to="/home" className={getNavClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={getNavClass}>
            Products
          </NavLink>

          <NavLink to="/wishlist" className={getNavClass}>
            Wishlist
          </NavLink>

          <NavLink to="/orders" className={getNavClass}>
            Orders
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 transition ${
                isActive
                  ? "bg-[#2b2b2b] text-white"
                  : "text-[#6b6258] hover:text-[#2b2b2b] hover:bg-[#e5ded3]"
              }`
            }
          >
            🛒 Cart

            {cartCount > 0 && (
              <span className="ml-1 min-w-[20px] h-[20px] px-1 rounded-full bg-[#2b2b2b] text-white text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl bg-[#2b2b2b] text-white text-sm font-medium hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
