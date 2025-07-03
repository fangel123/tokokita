import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Star } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Produk", path: "/dashboard/products", icon: Package },
    { name: "Pesanan", path: "/dashboard/orders", icon: ShoppingCart },
    { name: "Review", path: "/dashboard/reviews", icon: Star },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Seller Dashboard
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center py-3 px-6 transition-colors hover:bg-gray-700 ${
                  isActive ? "bg-primary" : ""
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-end items-center">
          <div className="text-gray-700">
            Welcome, <span className="font-semibold">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="ml-4 text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </header>
        <main className="flex-grow p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
