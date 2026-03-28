import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bug, Wheat, FlaskConical, CloudSun, IndianRupee, Sparkles, Droplets } from "lucide-react";
import { useTranslation } from "react-i18next";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Index = () => {
  const { t } = useTranslation();

const features = [
    {
      title: t("smart_recommendation"),
      desc: t("smart_desc"),
      icon: Sparkles,
      to: "/smart",
      color: "bg-primary/10 text-primary"
    },
    {
      title: t("disease_detection"),
      desc: t("disease_desc"),
      icon: Bug,
      to: "/disease",
      color: "bg-destructive/10 text-destructive"
    },
    {
      title: t("crop_recommendation"),
      desc: t("crop_desc"),
      icon: Wheat,
      to: "/recommend",
      color: "bg-primary/10 text-primary"
    },
    {
      title: t("fertilizer_recommendation"),
      desc: t("fertilizer_desc"),
      icon: Droplets,
      to: "/fertilizer",
      color: "bg-leaf/10 text-leaf"
    },
    {
      title: t("soil_analysis"),
      desc: t("soil_desc"),
      icon: FlaskConical,
      to: "/soil",
      color: "bg-earth/10 text-earth"
    },
    {
      title: t("weather_report"),
      desc: t("weather_desc"),
      icon: CloudSun,
      to: "/weather",
      color: "bg-sky/10 text-sky"
    },
    {
      title: t("market_prices"),
      desc: t("market_desc"),
      icon: IndianRupee,
      to: "/market",
      color: "bg-secondary/10 text-secondary"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          {t("welcome")} <span className="text-primary">{t("app_name")}</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">{t("tagline")}</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <motion.div key={f.to} variants={item}>
            <Link to={f.to} className="card-hover flex items-start gap-4 rounded-2xl border bg-card p-6 shadow-sm">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${f.color}`}>
                <f.icon className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{f.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="rounded-2xl border bg-accent/50 p-5">
        <h3 className="font-bold text-accent-foreground">{t("alerts_title")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("alerts_empty")}</p>
      </div>
    </div>
  );
};

export default Index;
