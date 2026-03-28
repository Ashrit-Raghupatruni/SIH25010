import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Wheat } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import axios from "axios";

const CropRecommendation = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fields = [
    { key: "nitrogen", label: t("nitrogen"), placeholder: "e.g. 90" },
    { key: "phosphorus", label: t("phosphorus"), placeholder: "e.g. 42" },
    { key: "potassium", label: t("potassium"), placeholder: "e.g. 43" },
    { key: "ph", label: t("ph_value"), placeholder: "e.g. 6.5" },
    { key: "temperature", label: t("temperature") + " (°C)", placeholder: "e.g. 25" },
    { key: "humidity", label: t("humidity") + " (%)", placeholder: "e.g. 80" },
    { key: "rainfall", label: t("rainfall") + " (mm)", placeholder: "e.g. 0.5" },
  ];

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const response = await axios.post(
      "http://localhost:8000/crop/recommend",
      {
        nitrogen: Number(form.nitrogen),
        phosphorus: Number(form.phosphorus),
        potassium: Number(form.potassium),
        ph: Number(form.ph),
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        rainfall: Number(form.rainfall),
      }
    );

    console.log("API RESPONSE:", response.data);

    setResult(response.data.recommended_crop);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch recommendation");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-extrabold">{t("crop_recommendation")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-sm font-bold text-muted-foreground">{f.label}</label>
              <input
                type="number"
                step="any"
                required
                placeholder={f.placeholder}
                value={form[f.key] || ""}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full rounded-xl border bg-background px-4 py-3 text-lg font-semibold outline-none ring-ring focus:ring-2"
              />
            </div>
          ))}
        </div>
        <Button type="submit" disabled={loading} size="lg" className="w-full rounded-xl py-6 text-lg font-bold">
          {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("analyzing")}</> : t("get_recommendation")}
        </Button>
      </form>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">{error}</div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3 rounded-2xl border bg-primary/10 p-8 text-center shadow-sm">
            <Wheat className="h-14 w-14 text-primary animate-float" />
            <p className="text-sm font-semibold text-muted-foreground">{t("recommended_crop")}</p>
            <p className="text-3xl font-extrabold text-primary">{result}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CropRecommendation;
