import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, TrendingUp, TrendingDown, Minus, IndianRupee, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface PriceResult {
  crop: string;
  price: number;
  trend: "up" | "down" | "stable";
  advice: "good_to_sell" | "prices_may_increase" | "hold_crop";
}

const popularCrops = ["Rice", "Wheat", "Cotton", "Sugarcane", "Soybean", "Maize"];

const mockPrices: Record<string, PriceResult> = {
  rice: { crop: "Rice", price: 2150, trend: "up", advice: "good_to_sell" },
  wheat: { crop: "Wheat", price: 2275, trend: "stable", advice: "prices_may_increase" },
  cotton: { crop: "Cotton", price: 6200, trend: "up", advice: "good_to_sell" },
  sugarcane: { crop: "Sugarcane", price: 350, trend: "down", advice: "hold_crop" },
  soybean: { crop: "Soybean", price: 4500, trend: "up", advice: "good_to_sell" },
  maize: { crop: "Maize", price: 1870, trend: "down", advice: "hold_crop" },
};

const MarketPrices = () => {
  const { t } = useTranslation();
  const [crop, setCrop] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PriceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop.trim()) return;
    await fetchPrice(crop.trim());
  };

  const fetchPrice = async (name: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const found = mockPrices[name.toLowerCase()];
      if (!found) {
        setError(t("invalid_crop"));
      } else {
        setResult(found);
        setRecentSearches((prev) => {
          const updated = [name, ...prev.filter((s) => s.toLowerCase() !== name.toLowerCase())].slice(0, 5);
          return updated;
        });
      }
    } catch {
      setError(t("server_error"));
    } finally {
      setLoading(false);
    }
  };

  const trendIcon = result?.trend === "up" ? TrendingUp : result?.trend === "down" ? TrendingDown : Minus;
  const TrendIcon = trendIcon;

  const trendColor =
    result?.trend === "up" ? "text-primary" : result?.trend === "down" ? "text-destructive" : "text-muted-foreground";

  const adviceColor =
    result?.advice === "good_to_sell"
      ? "bg-primary/10 text-primary border-primary/20"
      : result?.advice === "hold_crop"
        ? "bg-destructive/10 text-destructive border-destructive/20"
        : "bg-secondary/10 text-secondary border-secondary/20";

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-extrabold">{t("market_prices")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-bold text-muted-foreground">{t("crop_name")}</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("enter_crop")}
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full rounded-xl border bg-background pl-10 pr-4 py-3 text-lg font-semibold outline-none ring-ring focus:ring-2"
            />
          </div>
        </div>

        {/* Popular crops */}
        <div>
          <p className="mb-2 text-xs font-bold text-muted-foreground">{t("popular_crops")}</p>
          <div className="flex flex-wrap gap-2">
            {popularCrops.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { setCrop(c); fetchPrice(c); }}
                className="rounded-lg bg-muted px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading || !crop.trim()} size="lg" className="w-full rounded-xl py-6 text-lg font-bold">
          {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("fetching")}</> : t("get_price")}
        </Button>
      </form>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">{error}</div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Price card */}
            <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
              <p className="text-sm font-semibold text-muted-foreground">{t("current_price")}</p>
              <p className="mt-1 text-lg font-bold">{result.crop}</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <IndianRupee className="h-8 w-8 text-primary" />
                <span className="text-4xl font-extrabold text-primary">{result.price.toLocaleString()}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t("per_quintal")}</p>
            </div>

            {/* Trend */}
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">{t("price_trend")}</span>
                <div className={`flex items-center gap-1 font-bold ${trendColor}`}>
                  <TrendIcon className="h-5 w-5" />
                  <span className="capitalize">{result.trend}</span>
                </div>
              </div>
            </div>

            {/* Advice */}
            <div className={`rounded-2xl border p-5 ${adviceColor}`}>
              <p className="text-sm font-bold">{t("advice")}</p>
              <p className="mt-1 text-lg font-extrabold">{t(result.advice)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="mb-2 text-sm font-bold text-muted-foreground">{t("recent_searches")}</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <button
                key={s}
                onClick={() => { setCrop(s); fetchPrice(s); }}
                className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-primary/10"
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
