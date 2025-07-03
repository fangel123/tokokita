import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // State ini sangat penting untuk mencegah race condition
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cek otentikasi dari localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    const token = localStorage.getItem("tokokita_token");
    const storedUser = localStorage.getItem("tokokita_user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Setelah selesai memeriksa, set loading ke false
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user: loggedInUser } = response.data;

    localStorage.setItem("tokokita_token", token);
    localStorage.setItem("tokokita_user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    navigate(loggedInUser.role === "Seller" ? "/dashboard" : "/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tokokita_token");
    localStorage.removeItem("tokokita_user");
    navigate("/login");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
