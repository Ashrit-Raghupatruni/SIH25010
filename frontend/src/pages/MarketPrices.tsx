import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Loader2, IndianRupee } from "lucide-react";

const API_URL = "http://localhost:8000";

interface PriceResult {
  crop: string;
  price: number;
  trend: "up" | "down" | "stable";
  advice: string;
}

const popularCrops = ["Rice", "Wheat", "Cotton", "Maize"];

const MarketPrices = () => {
  const { t } = useTranslation();

  const [crop, setCrop] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PriceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const fetchPrice = async (
    crop: string,
    state: string = "Andhra Pradesh",
    district: string = "Guntur",
    variety: string | null = null
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/price/current`, {
        crop,
        state,
        district,
        variety,
      });

      console.log("API RESPONSE:", response.data);

      if (!response.data) {
        setError(t("invalid_crop"));
      } else {
        setResult(response.data);

        setRecentSearches((prev) => {
          const updated = [
            crop,
            ...prev.filter((s) => s.toLowerCase() !== crop.toLowerCase()),
          ].slice(0, 5);
          return updated;
        });
      }
    } catch (error: any) {
      console.error("ERROR:", error.response?.data || error.message);
      setError(error.response?.data?.detail || t("server_error"));
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FORM SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop.trim()) return;
    await fetchPrice(crop.trim());
  };

  // UI helpers
  const trendColor =
    result?.trend === "up"
      ? "text-green-600"
      : result?.trend === "down"
        ? "text-red-600"
        : "text-gray-600";

  const adviceColor =
    result?.advice === "sell"
      ? "bg-green-100 border-green-300"
      : result?.advice === "hold"
        ? "bg-yellow-100 border-yellow-300"
        : "bg-blue-100 border-blue-300";

  const TrendIcon = () => {
    if (result?.trend === "up") return <span>📈</span>;
    if (result?.trend === "down") return <span>📉</span>;
    return <span>➡️</span>;
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-extrabold">{t("market_prices")}</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border p-6"
      >
        <div>
          <label className="text-sm font-bold">
            {t("crop_name")}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5" />
            <input
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder={t("enter_crop")}
              className="w-full pl-10 py-3 border rounded-xl"
            />
          </div>
        </div>

        {/* Popular crops */}
        <div>
          <p className="text-xs font-bold">{t("popular_crops")}</p>
          <div className="flex flex-wrap gap-2">
            {popularCrops.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCrop(c);
                  fetchPrice(c);
                }}
                className="px-3 py-1 bg-gray-200 rounded-lg"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white rounded-xl"
        >
          {loading ? "Fetching..." : t("get_price")}
        </button>
      </form>

      {/* Error */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Price */}
            <div className="p-6 border rounded-xl text-center">
              <p>{t("current_price")}</p>
              <p className="font-bold">{result.crop}</p>
              <div className="flex justify-center items-center gap-2">
                <IndianRupee />
                <span className="text-3xl font-bold">
                  {result.price}
                </span>
              </div>
            </div>

            {/* Trend */}
            <div className={`p-4 border rounded-xl ${trendColor}`}>
              <TrendIcon /> {result.trend}
            </div>

            {/* Advice */}
            <div className={`p-4 border rounded-xl ${adviceColor}`}>
              {result.advice}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="p-4 border rounded-xl">
          <p className="font-bold">{t("recent_searches")}</p>
          <div className="flex gap-2 flex-wrap">
            {recentSearches.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setCrop(s);
                  fetchPrice(s);
                }}
                className="px-3 py-1 bg-gray-300 rounded-lg"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPrices;