import useApi from "../../hooks/useApi";

const DashboardOrdersPage = () => {
  const { data: orders, loading, error } = useApi("/seller/orders");

  if (loading) return <p className="text-center py-10">Memuat pesanan...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pesanan Masuk</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID Pesanan
              </th>
              <th scope="col" className="px-6 py-3">
                Produk
              </th>
              <th scope="col" className="px-6 py-3">
                Pembeli
              </th>
              <th scope="col" className="px-6 py-3">
                Tanggal
              </th>
              <th scope="col" className="px-6 py-3">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10">
                  Belum ada pesanan masuk.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-bold">#{order.id}</td>
                  <td className="px-6 py-4">
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id}>
                          - {item.product.name} (x{item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4">{order.buyer.name}</td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(order.total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardOrdersPage;
