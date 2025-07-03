const axios = require("axios");

const komerceRajaOngkirApi = axios.create({
  baseURL: process.env.KOMERCE_RAJAONGKIR_BASE_URL,
  headers: {
    Accept: "application/json",
    key: process.env.KOMERCE_API_KEY,
  },
});

// Fungsi searchDestinations Anda sudah benar
exports.searchDestinations = async (req, res) => {
  const { search } = req.query;
  if (!search || search.trim() === "") {
    return res.json([]);
  }
  try {
    const response = await komerceRajaOngkirApi.get(
      `/destination/domestic-destination?search=${search}`
    );
    res.json(response.data.data || []);
  } catch (error) {
    if (error.response?.data?.meta?.code === 404) {
      return res.json([]);
    }
    console.error(
      "Komerce API Error (searchDestinations):",
      error.response?.data
    );
    res.status(500).json({ message: "Gagal mencari destinasi" });
  }
};

// Fungsi calculateCost (dengan payload yang sudah diperbaiki)
exports.calculateCost = async (req, res) => {
  const { origin, destination, weight, courier } = req.body;
  if (!origin || !destination || !weight || !courier) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  // Ubah .toUpperCase() menjadi .toLowerCase() agar sesuai dengan pesan error
  const payload = {
    origin,
    destination,
    weight,
    courier: courier.toLowerCase(),
  };

  try {
    // Pengiriman ke Komerce sekarang menggunakan format form-data
    const params = new URLSearchParams();
    params.append("origin", payload.origin);
    params.append("destination", payload.destination);
    params.append("weight", payload.weight);
    params.append("courier", payload.courier);

    const response = await komerceRajaOngkirApi.post(
      "/calculate/domestic-cost",
      params,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    res.json(response.data.data);
  } catch (error) {
    console.error("Komerce API Error (calculateCost):", error.response?.data);
    const errorMessage =
      error.response?.data?.message || "Gagal menghitung ongkos kirim";
    res.status(error.response?.status || 500).json({ message: errorMessage });
  }
};
