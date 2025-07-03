import { motion } from "framer-motion";
import { Package, ShoppingCart, Star } from "lucide-react";
import useApi from "../../hooks/useApi";

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-lg shadow-md flex items-center"
  >
    <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

const DashboardOverview = () => {
  const { data: stats, loading } = useApi("/seller/stats");

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ringkasan</h1>
      {loading ? (
        <p>Memuat statistik...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Produk"
            value={stats?.totalProducts ?? 0}
            icon={<Package className="text-white w-6 h-6" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Pesanan Masuk"
            value={stats?.totalOrders ?? 0}
            icon={<ShoppingCart className="text-white w-6 h-6" />}
            color="bg-green-500"
          />
          <StatCard
            title="Rating Rata-rata"
            value={stats?.averageRating ?? 0}
            icon={<Star className="text-white w-6 h-6" />}
            color="bg-yellow-500"
          />
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
