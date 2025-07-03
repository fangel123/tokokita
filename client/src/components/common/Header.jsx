import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../contexts/CartContext";

const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          TokoKita
        </Link>
        <div className="hidden md:flex items-center space-x-6 text-gray-600">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "hover:text-primary"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "text-primary font-semibold" : "hover:text-primary"
            }
          >
            Produk
          </NavLink>
          {user && user.role === "Seller" && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "text-primary font-semibold" : "hover:text-primary"
              }
            >
              Dashboard
            </NavLink>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <ShoppingCart className="h-6 w-6 text-gray-700" />
            </Link>{" "}
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </button>
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Logout"
              >
                <LogOut className="h-6 w-6 text-red-500" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary"
            >
              <LogIn className="h-6 w-6" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
