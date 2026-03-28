import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  Home, Sparkles, Bug, FlaskConical, Droplets, CloudSun, IndianRupee, Wheat, Menu, X 
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { name: t("home") ?? "Dashboard", to: "/dashboard", icon: Home },
    { name: t("smart_recommendation"), to: "/smart", icon: Sparkles },
    { title: "Analysis Tools", type: "heading" },
    { name: t("disease_detection"), to: "/disease", icon: Bug },
    { name: t("soil_analysis"), to: "/soil", icon: FlaskConical },
    { name: t("fertilizer_recommendation"), to: "/fertilizer", icon: Droplets },
    { name: t("crop_recommendation"), to: "/recommend", icon: Wheat },
    { title: "Insights", type: "heading" },
    { name: t("weather_report"), to: "/weather", icon: CloudSun },
    { name: t("market_prices"), to: "/market", icon: IndianRupee },
  ];

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-bold text-primary-foreground text-sm">KM</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              Krishi<span className="text-primary">Mitra</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <Link to="/dashboard" className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="font-bold text-primary-foreground text-sm">KM</span>
          </Link>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent"
      >
        {collapsed ? <Menu className="h-3 w-3" /> : <X className="h-3 w-3" />}
      </button>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navigation.map((item, idx) => {
          if (item.type === "heading") {
            return (
              <div key={`head-${idx}`} className="mt-4 px-2 mb-2">
                {!collapsed ? (
                  <span className="text-xs font-semibold uppercase text-muted-foreground/70">
                    {item.title}
                  </span>
                ) : (
                  <div className="mx-auto h-px w-8 bg-border" />
                )}
              </div>
            );
          }

          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to as string}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors relative overflow-hidden",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed ? "justify-center px-0" : ""
              )}
              title={collapsed ? item.name : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center justify-center">
                {item.icon && <item.icon className="h-5 w-5" />}
              </div>
              {!collapsed && <span className="relative z-10 whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
