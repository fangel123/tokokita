import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/public/HomePage";
import ProductsPage from "./pages/public/ProductsPage";
import ProductDetailPage from "./pages/public/ProductDetailPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardProducts from "./pages/dashboard/DashboardProducts";
import AddProductPage from "./pages/dashboard/AddProductPage";
import EditProductPage from "./pages/dashboard/EditProductPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import DashboardOrdersPage from "./pages/dashboard/DashboardOrdersPage";
import DashboardReviewsPage from "./pages/dashboard/DashboardReviewsPage";

function App() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />{" "}
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>

      {/* Rute Otentikasi */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rute Dasbor Penjual (Terproteksi) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Seller"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="products" element={<DashboardProducts />} />
        <Route path="products/new" element={<AddProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        
        <Route path="orders" element={<DashboardOrdersPage />} />
        <Route path="reviews" element={<DashboardReviewsPage />} />
      </Route>

      {/* Rute 404 (Not Found) - Opsional */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}

export default App;
