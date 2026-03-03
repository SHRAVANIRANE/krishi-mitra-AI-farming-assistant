import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/dashboard/stats`).then((res) => res.json()),
      fetch(`${API_BASE_URL}/api/crop-health/history?limit=8`).then((res) =>
        res.json()
      ),
    ])
      .then(([statsData, historyData]) => {
        setStats([
          { value: statsData.total_acres, label: "Total Acres", tone: "sky" },
          { value: `${statsData.healthy_crops}%`, label: "Healthy Crops", tone: "emerald" },
          { value: statsData.active_alerts, label: "Active Alerts", tone: "rose" },
          { value: `${statsData.soil_moisture}%`, label: "Soil Moisture", tone: "amber" },
        ]);
        setRecentScans(historyData?.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard stats error:", err);
        setError("Unable to load dashboard data.");
        setLoading(false);
      });
  }, []);

  const healthyInRecent = useMemo(
    () => recentScans.filter((scan) => scan.is_healthy).length,
    [recentScans]
  );
  const diseasedInRecent = Math.max(recentScans.length - healthyInRecent, 0);
  const healthyWidth =
    recentScans.length > 0 ? (healthyInRecent / recentScans.length) * 100 : 0;

  const features = [
    {
      title: "Weather Prediction",
      desc: "Get accurate 5-day weather insights for planning.",
      footer: "Live Weather",
      icon: "Cloud",
      route: "/weather",
    },
    {
      title: "Crop Health Monitor",
      desc: "AI-powered crop disease detection and recommendations.",
      footer: "Scan Fields",
      icon: "Leaf",
      route: "/crop-health",
    },
    {
      title: "Pesticides Advisor",
      desc: "Smart and safer pest control recommendations.",
      footer: "Expert Advice",
      icon: "Lab",
      route: "/pesticides",
    },
    {
      title: "Virtual Farm Map",
      desc: "Track field status and monitor each zone.",
      footer: "View Zones",
      icon: "Map",
      route: "/farm-map",
    },
    {
      title: "Inspection Area",
      desc: "Detailed field inspection reports and logs.",
      footer: "Reports",
      icon: "Clipboard",
      route: "/inspection",
    },
    {
      title: "Farm Summary",
      desc: "Overview analytics and farm performance trends.",
      footer: "Insights",
      icon: "Chart",
      route: "/summary",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfdf3_0%,#f8fafc_50%,#eef2ff_100%)] p-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-emerald-100 bg-white/80 p-8 text-center text-emerald-700 shadow-sm">
          Loading dashboard data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfdf3_0%,#f8fafc_50%,#eef2ff_100%)] p-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfdf3_0%,#f8fafc_50%,#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Farm Control Center
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome to Krishi Mitra
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Your intelligent farming companion for crop health, irrigation, and planning.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 ${
                  item.tone === "emerald"
                    ? "border-emerald-100 bg-emerald-50"
                    : item.tone === "rose"
                    ? "border-rose-100 bg-rose-50"
                    : item.tone === "amber"
                    ? "border-amber-100 bg-amber-50"
                    : "border-sky-100 bg-sky-50"
                }`}
              >
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-slate-900">Explore Features</h3>
          <p className="mt-1 text-sm text-slate-600">
            Access your farm tools from one streamlined workspace.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, index) => (
              <Link to={item.route} key={index}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="mb-3 inline-flex rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-slate-900">{item.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                  <span className="mt-4 inline-block text-xs font-medium text-emerald-700">
                    {item.footer}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Recent Crop Scans</h3>
          <p className="mt-1 text-sm text-slate-600">
            Latest {recentScans.length} predictions from your database
          </p>

          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-emerald-700">Healthy: {healthyInRecent}</span>
              <span className="font-medium text-rose-700">Diseased: {diseasedInRecent}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full bg-emerald-500" style={{ width: `${healthyWidth}%` }} />
            </div>
          </div>

          {recentScans.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No scans available yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2 pr-4">Prediction</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map((scan) => (
                    <tr key={scan.id} className="border-b last:border-b-0">
                      <td className="py-2 pr-4 text-slate-800">{scan.prediction}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            scan.is_healthy
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {scan.is_healthy ? "Healthy" : "Attention Needed"}
                        </span>
                      </td>
                      <td className="py-2 text-slate-600">
                        {scan.created_at ? new Date(scan.created_at).toLocaleString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
