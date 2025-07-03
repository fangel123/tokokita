import axios from "axios";

// Buat instance Axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan interceptor permintaan (request interceptor)
// Ini akan dijalankan SEBELUM setiap permintaan dikirim
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem("tokokita_token");

    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Lakukan sesuatu jika terjadi error pada konfigurasi permintaan
    return Promise.reject(error);
  }
);

export default api;
