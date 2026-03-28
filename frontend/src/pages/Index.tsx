import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, Wheat, FlaskConical, CloudSun, IndianRupee, Sparkles, Droplets, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const heroImages = [
  {
    src: "/images/hero_farmer_tablet_1774675831498.png",
    alt: "Modern Farmer using Tablet",
  },
  {
    src: "/images/hero_farm_drone_1774675848676.png",
    alt: "Precision Farming with Drones",
  },
  {
    src: "/images/hero_farmer_wheat_1774675864735.png",
    alt: "Farmer in Wheat Field",
  }
];

const features = [
  {
    title: "smart_recommendation",
    desc: "smart_desc",
    icon: Sparkles,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "disease_detection",
    desc: "disease_desc",
    icon: Bug,
    color: "bg-destructive/10 text-destructive",
  },
  {
    title: "crop_recommendation",
    desc: "crop_desc",
    icon: Wheat,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "fertilizer_recommendation",
    desc: "fertilizer_desc",
    icon: Droplets,
    color: "bg-leaf/10 text-leaf",
  },
  {
    title: "soil_analysis",
    desc: "soil_desc",
    icon: FlaskConical,
    color: "bg-earth/10 text-earth",
  },
  {
    title: "weather_report",
    desc: "weather_desc",
    icon: CloudSun,
    color: "bg-sky/10 text-sky",
  },
  {
    title: "market_prices",
    desc: "market_desc",
    icon: IndianRupee,
    color: "bg-secondary/10 text-secondary",
  },
];

const Index = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={heroImages[currentSlide].src}
            alt={heroImages[currentSlide].alt}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center z-10">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight"
            >
              Empowering the Future of <br className="hidden md:block" />
              <span className="text-primary">Agriculture</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-medium"
            >
              Advanced AI-driven insights for farmers. Monitor crops, detect diseases, get smart recommendations, and increase your yield with KrishiMitra.
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/dashboard"
                className="group flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30"
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentSlide === idx ? "w-8 bg-primary" : "w-2 bg-white/50"
              )}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Everything you need to grow smarter
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Our comprehensive suite of tools leverages cutting-edge technology to give you the insights you need, exactly when you need them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:border-primary/50"
              >
                <div className={cn("inline-flex h-14 w-14 items-center justify-center rounded-xl mb-6", feature.color)}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3 font-sans">
                  {t(feature.title)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(feature.desc)}
                </p>
                <div className="absolute top-0 right-0 h-32 w-32 -mr-8 -mt-8 rounded-full bg-gradient-to-br from-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
