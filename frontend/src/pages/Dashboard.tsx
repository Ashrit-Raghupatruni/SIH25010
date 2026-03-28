import { useEffect, useState } from "react";
import { Wheat, ThermometerSun, Droplets, CloudRain, FlaskConical, Target, CloudSun } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("agri_result");
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      // Mock data for visual testing during UI upgrade if no real data is present.
      setData({
        recommended_crop: "Rice",
        confidence: 0.92,
        temperature: 28,
        humidity: 65,
        rainfall: 120,
        soil_status: "Healthy loam with optimal NPK ratio.",
        fertilizer_advice: [
          "Apply 50kg Urea per acre.",
          "Ensure standing water of 2-3 inches.",
        ],
        crop_info: {
          water: "High",
          growth: "120-150 Days",
        }
      });
    }
  }, []);

  if (!data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Target className="h-10 w-10 text-primary" />
        </div>
        <h2 className="mt-6 text-xl font-bold tracking-tight text-foreground">
          No Data Available Yet
        </h2>
        <p className="mt-2 text-muted-foreground max-w-sm text-center">
          Go to the Smart Recommendation assistant or other tools to generate actionable farming insights.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Overview Workspace
        </h1>
        <p className="text-muted-foreground mt-1">Here is the latest intelligence gathered for your farm fields.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Crop Card */}
        <div className="col-span-1 md:col-span-2 overflow-hidden rounded-2xl border bg-card p-6 shadow-sm flex flex-col justify-center relative">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
          <h2 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-2">Optimal Crop Recommendation</h2>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-extrabold text-primary">{data.recommended_crop}</span>
            <Wheat className="h-10 w-10 text-primary opacity-20 mb-1" />
          </div>
          {data.confidence && (
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-600">
                <Target className="h-3.5 w-3.5" />
                {(data.confidence * 100).toFixed(1)}% Confidence
              </div>
              <span>AI Prediction</span>
            </div>
          )}
        </div>

        {/* Soil Quick Stats */}
        <div className="col-span-1 border rounded-2xl bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-earth/10">
              <FlaskConical className="h-5 w-5 text-earth" />
            </div>
            <h3 className="font-semibold text-foreground">Soil Status</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.soil_status}
          </p>
        </div>
      </div>

      {/* Environmental Metrics */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <CloudSun className="h-5 w-5 text-sky" /> Environmental Factors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 border rounded-2xl bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sun/10">
              <ThermometerSun className="h-6 w-6 text-sun" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Temperature</p>
              <p className="text-2xl font-bold text-foreground">{data.temperature}°C</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border rounded-2xl bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky/10">
              <Droplets className="h-6 w-6 text-sky" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Humidity</p>
              <p className="text-2xl font-bold text-foreground">{data.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border rounded-2xl bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <CloudRain className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rainfall</p>
              <p className="text-2xl font-bold text-foreground">{data.rainfall} mm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Insights Split */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-2xl bg-card p-6 shadow-sm">
          <h3 className="font-bold text-foreground mb-4">🧪 Fertilizer Advisory</h3>
          <ul className="space-y-3">
            {data.fertilizer_advice.map((item: string, i: number) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {data.crop_info && (
          <div className="border rounded-2xl bg-card p-6 shadow-sm">
             <h3 className="font-bold text-foreground mb-4">🌿 Crop Lifecyle</h3>
             <div className="space-y-4">
                <div className="flex justify-between border-b pb-3">
                  <span className="text-muted-foreground text-sm">Water Requirement</span>
                  <span className="font-semibold text-sm">{data.crop_info.water}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Est. Growth Time</span>
                  <span className="font-semibold text-sm">{data.crop_info.growth}</span>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;