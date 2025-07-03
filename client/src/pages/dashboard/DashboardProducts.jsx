import { Link } from "react-router-dom";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import useApi from "../../hooks/useApi";

const DashboardProducts = () => {
  const {
    data: myProducts,
    loading,
    error,
    refetch,
  } = useApi("/products/my-products");

  const handleDelete = async (productId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await api.delete(`/products/${productId}`);
        alert("Produk berhasil dihapus.");
        refetch();
      } catch (err) {
        alert("Gagal menghapus produk.");
        console.error(err);
      }
    }
  };

  if (loading) return <p>Memuat produk Anda...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Produk</h1>
        <Link to="/dashboard/products/new">
          <Button className="flex items-center">
            <PlusCircle className="w-5 h-5 mr-2" />
            Tambah Produk
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nama Produk
              </th>
              <th scope="col" className="px-6 py-3">
                Kategori
              </th>

              <th scope="col" className="px-6 py-3">
                Harga
              </th>
              <th scope="col" className="px-6 py-3">
                Stok
              </th>
              <th scope="col" className="px-6 py-3">
                Rating
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {myProducts.map((product) => (
              <tr
                key={product.id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {product.name}
                </th>
                <td className="px-6 py-4">{product.category?.name || "-"}</td>
                <td className="px-6 py-4">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(product.price)}
                </td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.averageRating || 0}</td>
                <td className="px-6 py-4 flex justify-center space-x-2">
                  <Link
                    to={`/dashboard/products/edit/${product.id}`}
                    title="Edit"
                  >
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-5 h-5" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardProducts;
