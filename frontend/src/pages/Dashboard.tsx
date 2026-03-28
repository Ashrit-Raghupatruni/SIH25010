import { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("agri_result");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  if (!data) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-600">
          No data yet. Go to Assistant and generate results 🌾
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">
        📊 Dashboard
      </h1>

      {/* Crop */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">
          🌾 {data.recommended_crop}
        </h2>

        {data.confidence && (
          <p className="text-gray-600 mt-2">
            Confidence: {(data.confidence * 100).toFixed(2)}%
          </p>
        )}
      </div>

      {/* Weather */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          🌡 Temp: {data.temperature}°C
        </div>
        <div className="bg-blue-100 p-4 rounded-xl">
          💧 Humidity: {data.humidity}%
        </div>
        <div className="bg-blue-200 p-4 rounded-xl">
          🌧 Rainfall: {data.rainfall}
        </div>
      </div>

      {/* Soil */}
      <div className="bg-green-50 p-4 rounded-xl">
        🌱 Soil Status: {data.soil_status}
      </div>

      {/* Advice */}
      <div className="bg-yellow-50 p-4 rounded-xl">
        <h3 className="font-semibold mb-2">🧪 Advice</h3>
        <ul className="list-disc ml-6">
          {data.fertilizer_advice.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Crop Info */}
      {data.crop_info && (
        <div className="bg-green-100 p-4 rounded-xl">
          🌿 Water Requirement: {data.crop_info.water} <br />
          ⏳ Growth Time: {data.crop_info.growth}
        </div>
      )}
    </div>
  );
};

export default Dashboard;