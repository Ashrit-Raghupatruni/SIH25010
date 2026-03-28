import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FlaskConical, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

import axios from "axios";

const SoilAnalysis = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organic_carbon: "58", // ✅ DEFAULT VALUE HERE
  });
  const [result, setResult] = useState<string[] | null>(null);

  const soilFields = [
    { key: "ph", label: t("ph_level"), placeholder: "e.g. 6.5" },
    { key: "nitrogen", label: t("nitrogen_kg"), placeholder: "e.g. 120" },
    { key: "phosphorus", label: t("phosphorus_kg"), placeholder: "e.g. 25" },
    { key: "potassium", label: t("potassium_kg"), placeholder: "e.g. 200" },
    { key: "organic_carbon", label: t("organic_carbon (optional)"), placeholder: "e.g. 0.6" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/soil/analyze",
        {
          nitrogen: Number(form.nitrogen),
          phosphorus: Number(form.phosphorus),
          potassium: Number(form.potassium),
          ph: Number(form.ph),
        }
      );

      console.log("SOIL RESPONSE:", response.data);

      setResult([response.data.message]); // ✅ use backend message
    } catch (err) {
      console.error(err);
      setResult(["Error analyzing soil"]);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-extrabold">{t("soil_analysis")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
        {soilFields.map((f) => (
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

        <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border p-4 text-muted-foreground">
          <Upload className="h-6 w-6" />
          <span className="text-sm font-semibold">{t("upload_soil_report")}</span>
        </div>

        <Button type="submit" size="lg" className="w-full rounded-xl bg-earth py-6 text-lg font-bold text-earth-foreground">
          {t("analyze_soil")}
        </Button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-earth" />
              <h2 className="text-xl font-extrabold">{t("suggestions")}</h2>
            </div>
            <ul className="space-y-2">
              {result.map((s, i) => (
                <li key={i} className="rounded-xl bg-accent p-3 text-sm font-semibold text-accent-foreground">{s}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoilAnalysis;
