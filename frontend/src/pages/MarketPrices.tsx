import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, IndianRupee } from "lucide-react";

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
  const [stateName, setStateName] = useState("Andhra Pradesh");
  const [district, setDistrict] = useState("Guntur");
  const [variety, setVariety] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PriceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const fetchPrice = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/price/current`, {
        crop,
        state: stateName,
        district,
        variety: variety || null,
      });

      console.log("API RESPONSE:", response.data);

      setResult(response.data);

      setRecentSearches((prev) => {
        const updated = [
          crop,
          ...prev.filter((s) => s.toLowerCase() !== crop.toLowerCase()),
        ].slice(0, 5);
        return updated;
      });
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      setError(error.response?.data?.detail || t("server_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop.trim()) return;
    fetchPrice();
  };

  const trendColor =
    result?.trend === "up"
      ? "text-green-600"
      : result?.trend === "down"
        ? "text-red-600"
        : "text-gray-600";

  const adviceColor =
    result?.advice === "sell"
      ? "bg-green-100"
      : result?.advice === "hold"
        ? "bg-yellow-100"
        : "bg-blue-100";

  const TrendIcon = () => {
    if (result?.trend === "up") return <span>📈</span>;
    if (result?.trend === "down") return <span>📉</span>;
    return <span>➡️</span>;
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 rounded bg-gray-200">
          <ArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">{t("market_prices")}</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded-xl">

        <input
          type="text"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder="Crop"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          placeholder="State"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          placeholder="District"
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          value={variety}
          onChange={(e) => setVariety(e.target.value)}
          placeholder="Variety (optional)"
          className="w-full p-2 border rounded"
        />

        <button className="w-full bg-green-600 text-white py-2 rounded">
          {loading ? "Loading..." : "Get Price"}
        </button>
      </form>

      {/* Error */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="border p-4 rounded">
              <h2>{result.crop}</h2>
              <p className="text-2xl flex items-center gap-2">
                <IndianRupee /> {result.price}
              </p>
              <div className={trendColor}>
                <TrendIcon /> {result.trend}
              </div>
              <div className={adviceColor}>{result.advice}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketPrices;