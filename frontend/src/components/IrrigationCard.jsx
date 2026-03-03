import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

const IrrigationCard = ({ onBackToHome }) => {
  const [crop, setCrop] = useState("");
  const [soil, setSoil] = useState("");
  const [area, setArea] = useState("");

  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [options, setOptions] = useState({ crops: [], soils: [] });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/scheduler/options`)
      .then((res) => res.json())
      .then((data) => setOptions(data))
      .catch(() => {
        setOptions({
          crops: ["rice", "wheat", "cotton"],
          soils: ["sandy", "loamy", "clay"],
        });
      });
  }, []);

  const calculateIrrigation = () => {
    if (!crop || !soil || !area) {
      setError("Please fill all details before calculating.");
      return;
    }

    setError("");
    setSchedule(null);
    setLoading(true);

    fetch(`${API_BASE_URL}/api/scheduler`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ crop, soil, area }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || "Failed to calculate irrigation.");
        }
        return data;
      })
      .then((data) => {
        setSchedule(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Server error. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfdf3_0%,#f8fafc_50%,#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-100 bg-white/85 p-6 shadow-sm backdrop-blur sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
          Smart Water Management
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Irrigation Planner
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Get water requirement and run-time estimates based on crop and soil type.
        </p>

        <div className="mt-6 space-y-3">
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 focus:ring"
          >
            <option value="">Select Crop</option>
            {options.crops.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={soil}
            onChange={(e) => setSoil(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 focus:ring"
          >
            <option value="">Select Soil Type</option>
            {options.soils.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Field Area (acres)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 focus:ring"
          />

          <button
            onClick={calculateIrrigation}
            className="w-full rounded-xl bg-teal-600 px-5 py-2.5 font-semibold text-white transition hover:bg-teal-700"
          >
            Calculate Irrigation
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Calculating irrigation plan...
          </p>
        ) : null}

        {schedule ? (
          <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50 p-4 text-slate-800">
            <p>
              <strong>Crop:</strong> {schedule.crop}
            </p>
            <p>
              Give <strong>{schedule.water_needed_liters} liters</strong> of water
            </p>
            <p>
              Run irrigation for <strong>{schedule.duration_minutes} minutes</strong>
            </p>
            <p className="mt-2 text-sm font-semibold text-teal-700">{schedule.message}</p>
          </div>
        ) : null}

        {onBackToHome ? (
          <button
            onClick={onBackToHome}
            className="mt-5 w-full rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default IrrigationCard;
