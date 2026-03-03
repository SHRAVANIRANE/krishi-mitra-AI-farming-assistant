import React from "react";
import { getRecommendation, severityLabel } from "./diagnosisHelpers";

export default function FieldCard({
  file,
  diagnosis,
  overallHealth,
  healthyCount,
  needAttentionCount,
}) {
  if (!file) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Analysis Result</h2>
        <p className="mt-2 text-slate-600">
          Select an image and run diagnosis to view prediction details.
        </p>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Analysis Ready</h2>
        <p className="mt-2 text-slate-600">
          File selected: <span className="font-medium text-slate-900">{file.name}</span>
        </p>
        <p className="mt-1 text-slate-500">Press Run Diagnosis to start prediction.</p>
      </div>
    );
  }

  const { prediction, confidence } = diagnosis;
  const isHealthy = prediction.toLowerCase().includes("healthy");
  const confidencePct = Math.max(0, Math.min(100, Number((confidence * 100).toFixed(1))));
  const severity = severityLabel(confidence);
  const recommendation = getRecommendation(prediction);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Analysis Result</h2>
          <p className="mt-1 text-sm text-slate-500">{prediction}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            isHealthy
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {isHealthy ? "Healthy" : "Attention Needed"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Confidence</p>
          <p className="text-lg font-semibold text-slate-900">{confidencePct}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Severity</p>
          <p className="text-lg font-semibold text-slate-900">{severity}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Farm Health</p>
          <p className="text-lg font-semibold text-slate-900">{overallHealth ?? 0}%</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Model certainty</span>
          <span>{confidencePct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full ${isHealthy ? "bg-emerald-500" : "bg-rose-500"}`}
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Recommendation</h3>
        <p className="mt-2 text-sm text-slate-700">{recommendation}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Healthy Fields</p>
          <p className="text-base font-semibold text-emerald-700">{healthyCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Needs Attention</p>
          <p className="text-base font-semibold text-rose-700">{needAttentionCount ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
