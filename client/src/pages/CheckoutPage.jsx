import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import api from "../lib/api";
import Button from "../components/ui/Button";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  // --- State untuk sistem pencarian destinasi ---
  const [searchTerm, setSearchTerm] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // --- State untuk ongkos kirim ---
  const [shippingCosts, setShippingCosts] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isLoadingCost, setIsLoadingCost] = useState(false);
  const [costError, setCostError] = useState(null);

  // State baru untuk menandakan proses pembayaran
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Hanya cari jika pengguna mengetik setidaknya 3 karakter
    if (searchTerm.trim().length < 3) {
      setDestinations([]);
      setNoResults(false);
      return;
    }

    setIsSearching(true);
    setNoResults(false);

    // Debounce: tunggu 500ms setelah user berhenti mengetik sebelum memanggil API
    const delayDebounceFn = setTimeout(() => {
      api
        .get(`/shipping/destinations?search=${searchTerm}`)
        .then((res) => {
          const resultData = res.data || [];
          setDestinations(resultData);
          if (resultData.length === 0) {
            setNoResults(true); // Set flag jika API mengembalikan array kosong
          }
        })
        .catch((err) => console.error("Gagal mencari destinasi", err))
        .finally(() => setIsSearching(false));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleCalculateCost = () => {
    if (!selectedDestination) {
      alert("Pilih kota tujuan dari hasil pencarian terlebih dahulu.");
      return;
    }
    setIsLoadingCost(true);
    setCostError(null);
    setShippingCosts([]);
    setSelectedShipping(null);

    const payload = {
      origin: "114",
      destination: selectedDestination.id,
      weight: 1000,
      courier: "jne",
    };

    api
      .post("/shipping/cost", payload)
      .then((res) => setShippingCosts(res.data || []))
      .catch(() => setCostError("Gagal menghitung ongkos kirim. Coba lagi."))
      .finally(() => setIsLoadingCost(false));
  };

  const handleFinalizePurchase = async () => {
    if (!selectedShipping) {
      alert("Silakan pilih layanan pengiriman terlebih dahulu.");
      return;
    }

    setIsProcessing(true); // Mulai proses, nonaktifkan tombol

    // 1. Siapkan payload yang akan dikirim ke backend
    const payload = {
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      // Anda juga bisa mengirim info shipping di sini jika backend memerlukannya
      shippingDetails: selectedShipping,
    };

    try {
      // 2. Kirim data ke backend untuk membuat pesanan
      await api.post("/orders", payload);

      // 3. Jika berhasil, baru lakukan aksi di frontend
      alert("Pembayaran berhasil! Terima kasih telah berbelanja.");
      clearCart();
      navigate("/");
    } catch (err) {
      // Tampilkan error jika backend gagal membuat pesanan
      alert(
        err.response?.data?.error ||
          "Gagal memproses pesanan Anda. Silakan coba lagi."
      );
      console.error(err);
    } finally {
      setIsProcessing(false); // Selesai proses, aktifkan kembali tombol
    }
  };

  // Kalkulasi total akhir yang dinamis
  const finalTotal = cartTotal + (selectedShipping ? selectedShipping.cost : 0);

  // Tampilkan pesan jika keranjang kosong
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Keranjang Anda kosong.</h1>
        <p className="mt-2 text-gray-600">Tidak ada yang bisa di-checkout.</p>
        <Link
          to="/products"
          className="text-primary mt-4 inline-block hover:underline"
        >
          Kembali berbelanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Ringkasan Pesanan */}
      <div className="mb-8 border-b pb-4">
        <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span>
                {item.product.name}{" "}
                <span className="text-gray-500">x{item.quantity}</span>
              </span>
              <span className="font-medium">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alamat Pengiriman dengan Sistem Pencarian */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Alamat Pengiriman</h2>
        <div className="relative">
          <label
            htmlFor="destination-search"
            className="block text-gray-700 mb-1"
          >
            Cari Kota / Kecamatan Tujuan
          </label>
          <input
            id="destination-search"
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Ketik min. 3 huruf (e.g., 'Bandung')"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedDestination(null);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            autoComplete="off"
          />
          {isSearching && (
            <p className="text-sm text-gray-500 mt-1">Mencari...</p>
          )}

          {showResults && searchTerm.length >= 3 && (
            <ul className="absolute z-10 w-full bg-white border mt-1 rounded-lg max-h-60 overflow-y-auto shadow-lg">
              {destinations.length > 0
                ? destinations.map((dest) => (
                    <li
                      key={dest.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchTerm(
                          `${dest.subdistrict_name}, ${dest.city_name}`
                        );
                        setSelectedDestination(dest);
                        setShowResults(false);
                      }}
                    >
                      <p className="font-semibold">
                        {dest.subdistrict_name}, {dest.city_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {dest.province_name}
                      </p>
                    </li>
                  ))
                : !isSearching &&
                  noResults && (
                    <li className="p-3 text-sm text-gray-500 text-center">
                      Lokasi tidak ditemukan.
                    </li>
                  )}
            </ul>
          )}
        </div>
        <Button
          onClick={handleCalculateCost}
          disabled={isLoadingCost || !selectedDestination}
        >
          {isLoadingCost ? "Menghitung..." : "Cek Ongkos Kirim"}
        </Button>
        {costError && <p className="text-red-500 text-sm mt-1">{costError}</p>}
      </div>

      {/* Pilihan Layanan Pengiriman */}
      {shippingCosts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Pilih Layanan Pengiriman:</h3>
          <div className="space-y-2 mt-2">
            {shippingCosts.map((item) => (
              <div
                key={item.code + item.service}
                className={`p-3 border rounded-lg flex justify-between items-center cursor-pointer transition-all ${
                  selectedShipping?.service === item.service
                    ? "border-primary ring-2 ring-primary"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedShipping(item)}
              >
                <div>
                  <p className="font-bold">
                    {item.name} ({item.service})
                  </p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="text-sm text-gray-500">
                    Estimasi: {item.etd || "-"}
                  </p>
                </div>
                <p className="font-semibold text-lg">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(item.cost)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rincian Total Pembayaran */}
      <div className="mt-10 border-t pt-6">
        <div className="space-y-2 text-right mb-4">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(cartTotal)}
            </p>
          </div>
          {selectedShipping && (
            <div className="flex justify-between">
              <p>
                Ongkos Kirim ({selectedShipping.name} -{" "}
                {selectedShipping.service})
              </p>
              <p>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(selectedShipping.cost)}
              </p>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold pt-2">
            <p>Total Pembayaran</p>
            <p className="text-primary">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(finalTotal)}
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleFinalizePurchase}
            className="mt-4"
            disabled={!selectedShipping || isProcessing} // Nonaktifkan jika sedang memproses
          >
            Selesaikan Pembayaran
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
