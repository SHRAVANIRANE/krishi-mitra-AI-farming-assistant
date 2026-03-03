import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import UploadSection from "./UploadSection.jsx";
import { API_BASE_URL } from "../../config";
import FieldCard from "./FieldCard.jsx";
import FarmSummary from "./FarmSummary";

const CropHealthMonitor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);

  const [summary, setSummary] = useState({
    total_fields: 0,
    healthy_percentage: 0,
    diseased_fields: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const healthyCount = useMemo(
    () => Math.max(summary.total_fields - summary.diseased_fields, 0),
    [summary]
  );

  const fetchCropSummary = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/crop-health/summary`);
      if (!res.ok) {
        throw new Error("Failed to load crop summary");
      }
      const data = await res.json();
      setSummary({
        total_fields: Number(data.total_fields || 0),
        healthy_percentage: Number(data.healthy_percentage || 0),
        diseased_fields: Number(data.diseased_fields || 0),
      });
    } catch (err) {
      console.error("Summary fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCropSummary();
  }, []);

  const handleUploadAndPredict = async () => {
    if (!selectedFile) {
      setError("Please upload an image file.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDiagnosis(res.data);
      await fetchCropSummary();
    } catch (err) {
      console.error(err);
      const backendMessage = err?.response?.data?.detail;
      setError(backendMessage || "Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfdf3_0%,#f8fafc_50%,#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Precision Diagnostics
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Crop Health Monitor
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Upload a field image to generate disease prediction, confidence level,
            and an actionable recommendation.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
              <p className="text-xs text-slate-500">Total Scans</p>
              <p className="text-xl font-semibold text-slate-900">{summary.total_fields}</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
              <p className="text-xs text-slate-500">Healthy</p>
              <p className="text-xl font-semibold text-emerald-700">{healthyCount}</p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50 p-3">
              <p className="text-xs text-slate-500">Needs Attention</p>
              <p className="text-xl font-semibold text-rose-700">{summary.diseased_fields}</p>
            </div>
            <div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
              <p className="text-xs text-slate-500">Health Score</p>
              <p className="text-xl font-semibold text-sky-700">{summary.healthy_percentage}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <UploadSection
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              onPredict={handleUploadAndPredict}
              loading={loading}
            />
            {error ? (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="space-y-6 xl:col-span-8">
            <FieldCard
              file={selectedFile}
              diagnosis={diagnosis}
              overallHealth={summary.healthy_percentage}
              healthyCount={healthyCount}
              needAttentionCount={summary.diseased_fields}
            />
            <FarmSummary summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropHealthMonitor;

