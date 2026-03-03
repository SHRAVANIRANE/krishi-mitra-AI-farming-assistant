import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex min-h-[calc(100vh-73px)] w-full items-center justify-center overflow-hidden px-4 text-center"
      style={{ backgroundImage: "url('src/assets/farm2.jpeg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/65 via-slate-900/55 to-emerald-900/50" />

      <div className="relative z-10 mx-auto max-w-4xl  p-8   sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
          AI for Smart Farming
        </p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white sm:text-7xl">
          Krishi Mitra
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-emerald-50 sm:text-lg">
          Detect crop diseases early, track farm health trends, and make better
          irrigation decisions with one connected platform.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600"
          >
            Open Dashboard
          </button>
          <button
            type="button"
            onClick={() => navigate("/crop-health")}
            className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Start Crop Scan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
