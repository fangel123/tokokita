import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Ambil 'loading' dari context
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Jika context masih dalam proses memeriksa otentikasi,
  // jangan render apa-apa dulu (atau tampilkan spinner loading).
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Memuat...</div>
      </div>
    );
  }

  // Setelah loading selesai, baru lakukan pengecekan otentikasi
  if (!isAuthenticated) {
    // Jika tidak login, redirect ke halaman login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika role tidak diizinkan, redirect ke halaman utama
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Jika semua pengecekan lolos, tampilkan halaman yang diminta
  return children;
};

export default ProtectedRoute;
