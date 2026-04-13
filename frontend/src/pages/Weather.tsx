import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Loader2, Thermometer, Droplets, CloudRain } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  description: string;
}

const Weather = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (loc?: string) => {
    const targetLocation = loc || location;
    if (!targetLocation) return;

    setLoading(true);
    setError(null);
    try {
      const resp = await axios.post("http://localhost:8000/weather/current", {
        location: targetLocation,
      });
      setData(resp.data);
    } catch (err) {
      console.error(err);
      setError(t("weather_error"));
    } finally {
      setLoading(false);
    }
  };

  const useGPS = () => {
    if (!navigator.geolocation) {
      setError(t("gps_not_supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // For simplicity, using coordinates as the location string
        const loc = `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;
        setLocation(loc);
        fetchWeather(loc);
      },
      () => setError(t("location_denied"))
    );
  };

  const stats = data
    ? [
      {
        icon: Thermometer,
        label: t("temperature"),
        value: `${data.temperature}°C`,
        color: "text-secondary",
      },
      { icon: Droplets, label: t("humidity"), value: `${data.humidity}%`, color: "text-sky" },
      { icon: CloudRain, label: t("rainfall"), value: `${data.rainfall} mm`, color: "text-primary" },
    ]
    : [];

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-extrabold">{t("weather_report")}</h1>
      </div>

      <div className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
        <label className="mb-1 block text-sm font-bold text-muted-foreground">{t("location")}</label>
        <input
          type="text"
          placeholder={t("enter_location")}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") fetchWeather(); }}
          className="w-full rounded-xl border bg-background px-4 py-3 text-lg font-semibold outline-none ring-ring focus:ring-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => fetchWeather()}
            disabled={loading || !location}
            size="lg"
            className="rounded-xl bg-sky py-5 text-lg font-bold text-sky-foreground"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t("check_weather")}
          </Button>
          <Button onClick={useGPS} variant="outline" size="lg" className="rounded-xl py-5 text-lg font-bold">
            <MapPin className="mr-2 h-5 w-5" /> {t("use_gps")}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
              <p className="text-sm font-semibold text-muted-foreground">{t("current_conditions")}</p>
              <p className="mt-1 text-2xl font-extrabold">{data.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-5 shadow-sm"
                >
                  <s.icon className={`h-8 w-8 ${s.color}`} />
                  <span className="text-xs font-semibold text-muted-foreground">{s.label}</span>
                  <span className="text-xl font-extrabold">{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Weather;
