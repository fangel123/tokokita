import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import api from "../../lib/api"; // Impor instance Axios
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

// Skema validasi Zod (tidak berubah)
const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Nama minimal 2 karakter." }),
    email: z.string().email({ message: "Format email tidak valid." }),
    password: z.string().min(8, { message: "Password minimal 8 karakter." }),
    confirmPassword: z.string(),
    role: z.enum(["Buyer", "Seller"], { message: "Silakan pilih peran." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Buyer",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);
    setIsLoading(true);

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.format());
      setIsLoading(false);
      return;
    }

    try {
      // Hapus confirmPassword, backend tidak memerlukannya
      const { confirmPassword, ...dataToSend } = result.data;
      await api.post("/auth/register", dataToSend);

      alert("Registrasi berhasil! Anda akan diarahkan ke halaman login.");
      navigate("/login");
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Terjadi kesalahan saat registrasi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Buat Akun Baru
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Bergabunglah dengan TokoKita hari ini!
        </p>

        {apiError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4 text-sm"
            role="alert"
          >
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="name"
              name="name"
              label="Nama Lengkap"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name._errors[0]}
              </p>
            )}
          </div>
          <div>
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email._errors[0]}
              </p>
            )}
          </div>
          <div>
            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password._errors[0]}
              </p>
            )}
          </div>
          <div>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Konfirmasi Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword._errors[0]}
              </p>
            )}
          </div>
          <div className="text-sm">
            <label className="font-medium text-gray-700">Daftar sebagai:</label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="Buyer"
                  checked={formData.role === "Buyer"}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="mr-2"
                />{" "}
                Buyer
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="Seller"
                  checked={formData.role === "Seller"}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="mr-2"
                />{" "}
                Seller
              </label>
            </div>
          </div>
          <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
            {isLoading ? "Mendaftar..." : "Daftar"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Login di sini
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
