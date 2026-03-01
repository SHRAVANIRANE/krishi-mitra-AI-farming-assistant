import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard stats
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats([
          { value: data.total_acres, label: "Total Acres" },
          { value: `${data.healthy_crops}%`, label: "Healthy Crops" },
          { value: data.active_alerts, label: "Active Alerts" },
          { value: `${data.soil_moisture}%`, label: "Soil Moisture" },
        ]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard stats error:", err);
        setError("Unable to load dashboard data.");
        setLoading(false);
      });
  }, []);

  const features = [
    {
      title: "Weather Prediction",
      desc: "Get accurate 7-day weather forecasts",
      footer: "Live Weather",
      icon: "🌦️",
      route: "/weather",
    },
    {
      title: "Crop Health Monitor",
      desc: "AI-powered crop disease detection",
      footer: "Scan Fields",
      icon: "🌱",
      route: "/crop-health",
    },
    {
      title: "Pesticides Advisor",
      desc: "Smart pest control recommendations",
      footer: "Expert Advice",
      icon: "🧪",
      route: "/pesticides",
    },
    {
      title: "Virtual Farm Map",
      desc: "Real-time field monitoring",
      footer: "View Zones",
      icon: "🗺️",
      route: "/farm-map",
    },
    {
      title: "Inspection Area",
      desc: "Detailed field inspection data",
      footer: "Reports",
      icon: "📋",
      route: "/inspection",
    },
    {
      title: "Farm Summary",
      desc: "Reports & analytics dashboard",
      footer: "Insights",
      icon: "📊",
      route: "/summary",
    },
  ];

  // Loading UI
  if (loading) {
    return (
      <div className="p-6 text-center text-green-700">
        Loading dashboard data...
      </div>
    );
  }

  // Error UI
  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col p-6 bg-green-50 min-h-screen">
      {/* 🌿 Welcome Banner */}
      <div className="bg-green-600 text-white rounded-xl p-6 shadow-lg mb-10">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold mb-2">
            Welcome to Krishi Mitra! 🌿
          </h2>
          <p className="text-green-100 text-lg">
            Your intelligent farming companion for better crop management
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, i) => (
            <div key={i} className="bg-green-500 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-green-100">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔍 Explore Features */}
      <h3 className="text-xl font-semibold text-green-800 mb-2">
        Explore Features
      </h3>
      <p className="text-gray-600 mb-6">
        Access all farming management tools in one place
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, index) => (
          <Link to={item.route} key={index}>
            <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition cursor-pointer h-full">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-semibold text-green-800 mb-1">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
              <span className="text-xs text-green-600 font-medium">
                {item.footer}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
