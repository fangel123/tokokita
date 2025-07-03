import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";

/**
 * Custom Hook untuk mengambil data dari API secara terpusat.
 * Mengelola state data, loading, dan error secara otomatis.
 * @param {string} url - Endpoint API yang akan dipanggil (e.g., '/products').
 * @returns {{data: any, loading: boolean, error: any, refetch: function}}
 */
const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(url);
      setData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat mengambil data."
      );
      console.error(`API Error on ${url}:`, err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;
