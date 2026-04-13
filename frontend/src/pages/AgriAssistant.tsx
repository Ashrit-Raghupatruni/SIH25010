import { useState } from "react";
import axios from "axios";

const AgriAssistant = () => {
  const [form, setForm] = useState({
    location: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setResult(null);

      const response = await axios.post(
        "http://localhost:8000/crop/smart",
        {
          location: form.location,
          nitrogen: Number(form.nitrogen),
          phosphorus: Number(form.phosphorus),
          potassium: Number(form.potassium),
          ph: Number(form.ph),
        }
      );

      localStorage.setItem("agri_result", JSON.stringify(response.data));
      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        🌾 Agri Assistant
      </h1>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow">
        <input
          name="location"
          placeholder="Location (e.g., Hyderabad)"
          className="p-3 border rounded-lg"
          onChange={handleChange}
        />

        <input
          name="ph"
          placeholder="Soil pH"
          className="p-3 border rounded-lg"
          onChange={handleChange}
        />

        <input
          name="nitrogen"
          placeholder="Nitrogen (N)"
          className="p-3 border rounded-lg"
          onChange={handleChange}
        />

        <input
          name="phosphorus"
          placeholder="Phosphorus (P)"
          className="p-3 border rounded-lg"
          onChange={handleChange}
        />

        <input
          name="potassium"
          placeholder="Potassium (K)"
          className="p-3 border rounded-lg"
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          className="col-span-1 md:col-span-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Analyzing..." : "Get Recommendation"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-2xl font-semibold text-green-700">
            🌾 Recommended Crop: {result.recommended_crop}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              🌡 Temperature: {result.temperature}°C
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              💧 Humidity: {result.humidity}%
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              🌧 Rainfall: {result.rainfall}
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              🌱 Soil: {result.soil_status}
            </div>
          </div>

          {/* Confidence */}
          {result.confidence && (
            <div className="p-4 bg-gray-100 rounded-lg">
              📊 Confidence: {(result.confidence * 100).toFixed(2)}%
            </div>
          )}

          {/* Advice */}
          <div>
            <h3 className="font-semibold text-lg mb-2">🧪 Advice</h3>
            <ul className="list-disc ml-6">
              {result.fertilizer_advice.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Crop Info */}
          {result.crop_info && (
            <div className="p-4 bg-green-100 rounded-lg">
              🌿 Water: {result.crop_info.water} <br />
              ⏳ Growth: {result.crop_info.growth}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgriAssistant;