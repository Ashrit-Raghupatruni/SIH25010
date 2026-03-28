import { useState } from "react";
import axios from "axios";

const FertilizerRecommendation = () => {
  const [form, setForm] = useState({
    temperature: "",
    humidity: "",
    moisture: "",
    soil_type: "",
    crop_type: "",
    nitrogen: "",
    potassium: "",
    phosphorus: "",
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setResult(null);

      const response = await axios.post(
        "http://localhost:8000/fertilizer/recommend",
        {
          temperature: Number(form.temperature),
          humidity: Number(form.humidity),
          moisture: Number(form.moisture),
          soil_type: form.soil_type,
          crop_type: form.crop_type,
          nitrogen: Number(form.nitrogen),
          potassium: Number(form.potassium),
          phosphorus: Number(form.phosphorus),
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching fertilizer recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        🧪 Fertilizer Recommendation
      </h1>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow">

        <input name="temperature" placeholder="Temperature (°C)" className="p-3 border rounded-lg" onChange={handleChange} />
        <input name="humidity" placeholder="Humidity (%)" className="p-3 border rounded-lg" onChange={handleChange} />
        <input name="moisture" placeholder="Soil Moisture" className="p-3 border rounded-lg" onChange={handleChange} />

        {/* Soil Type */}
        <select name="soil_type" className="p-3 border rounded-lg" onChange={handleChange}>
          <option value="">Select Soil Type</option>
          <option value="sandy">Sandy</option>
          <option value="loamy">Loamy</option>
          <option value="black">Black</option>
          <option value="red">Red</option>
          <option value="clay">Clay</option>
        </select>

        {/* Crop Type */}
        <select name="crop_type" className="p-3 border rounded-lg" onChange={handleChange}>
          <option value="">Select Crop Type</option>
          <option value="rice">Rice</option>
          <option value="maize">Maize</option>
          <option value="cotton">Cotton</option>
          <option value="sugarcane">Sugarcane</option>
        </select>

        <input name="nitrogen" placeholder="Nitrogen (N)" className="p-3 border rounded-lg" onChange={handleChange} />
        <input name="phosphorus" placeholder="Phosphorus (P)" className="p-3 border rounded-lg" onChange={handleChange} />
        <input name="potassium" placeholder="Potassium (K)" className="p-3 border rounded-lg" onChange={handleChange} />

        <button
          onClick={handleSubmit}
          className="col-span-1 md:col-span-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Analyzing..." : "Get Fertilizer"}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-2xl font-semibold text-green-700">
            🌱 Recommended Fertilizer
          </h2>

          <p className="text-xl mt-4 font-bold text-gray-800">
            {result.recommended_fertilizer}
          </p>
        </div>
      )}
    </div>
  );
};

export default FertilizerRecommendation;