import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import api from "../../lib/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ArrowLeft } from "lucide-react";

// Skema validasi bisa kita gunakan lagi
const productSchema = z.object({
  name: z.string().min(5, { message: "Nama produk minimal 5 karakter." }),
  description: z
    .string()
    .min(20, { message: "Deskripsi minimal 20 karakter." }),
  price: z.coerce.number().positive({ message: "Harga harus angka positif." }),
  stock: z.coerce
    .number()
    .int()
    .nonnegative({ message: "Stok harus angka bulat non-negatif." }),
  imageUrl: z.string().url({ message: "URL gambar tidak valid." }),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
});

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    // Ambil data produk dan daftar kategori secara bersamaan
    const loadInitialData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get("/categories"),
        ]);

        const productData = productRes.data;
        setFormData({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          imageUrl: productData.imageUrl,
          categoryId: productData.categoryId || "", // Set ke string kosong jika null
        });
        setCategories(categoriesRes.data);
      } catch (err) {
        setApiError("Gagal memuat data untuk form edit.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);
    setIsSubmitting(true);

    const dataToValidate = {
      ...formData,
      categoryId: formData.categoryId ? formData.categoryId : null,
    };

    const result = productSchema.safeParse(dataToValidate);

    if (!result.success) {
      setErrors(result.error.format());
      setIsSubmitting(false);
      return;
    }

    try {
      // Gunakan metode PUT untuk mengupdate
      await api.put(`/products/${id}`, result.data);
      alert("Produk berhasil diperbarui!");
      navigate("/dashboard/products");
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Terjadi kesalahan di server."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return <p className="text-center py-10">Memuat data produk...</p>;
  if (apiError)
    return <p className="text-center py-10 text-red-500">{apiError}</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/dashboard/products"
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Edit Produk</h1>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              id="name"
              name="name"
              label="Nama Produk"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name._errors[0]}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Deskripsi Produk
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description._errors[0]}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                id="price"
                name="price"
                label="Harga (Rp)"
                type="number"
                value={formData.price}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price._errors[0]}
                </p>
              )}
            </div>
            <div>
              <Input
                id="stock"
                name="stock"
                label="Stok"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stock._errors[0]}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kategori
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.categoryId}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">-- Tidak Ada Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryId._errors[0]}
              </p>
            )}
          </div>
          <div>
            <Input
              id="imageUrl"
              name="imageUrl"
              label="URL Gambar Produk"
              value={formData.imageUrl}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.imageUrl._errors[0]}
              </p>
            )}
          </div>
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProductPage;
