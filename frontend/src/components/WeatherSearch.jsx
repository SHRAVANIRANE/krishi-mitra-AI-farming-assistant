import { useEffect, useMemo, useState } from "react";
import { WEATHER_API_KEY } from "../config";

const sanitizeApiKey = (key) => key.replace(/^['"]|['"];?$/g, "").trim();

const adviceTone = {
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
  caution: "border-amber-300 bg-amber-50 text-amber-800",
  warning: "border-rose-300 bg-rose-50 text-rose-800",
};

const WeatherSearch = () => {
  const apiKey = sanitizeApiKey(WEATHER_API_KEY || "");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [weatherError, setWeatherError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Location error:", error);
        setLocationError("Location access denied. Please enable GPS permission.");
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!location || !apiKey) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setWeatherError("");

        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`
        );
        const currentData = await currentRes.json();
        if (!currentRes.ok) {
          throw new Error(currentData?.message || "Failed to fetch current weather.");
        }

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`
        );
        const forecastData = await forecastRes.json();
        if (!forecastRes.ok) {
          throw new Error(forecastData?.message || "Failed to fetch forecast.");
        }

        const list = Array.isArray(forecastData.list) ? forecastData.list : [];
        const dailyForecast = list.filter((_, i) => i % 8 === 0).slice(0, 5);

        setCurrentWeather(currentData);
        setForecast(dailyForecast);
      } catch (error) {
        console.error("Weather fetch error:", error);
        setCurrentWeather(null);
        setForecast([]);
        setWeatherError(error.message || "Unable to load weather right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, apiKey]);

  const farmingAdvice = useMemo(() => {
    if (!currentWeather) return [];

    const advice = [];
    const rain = (forecast[0]?.pop || 0) * 100;
    const temp = currentWeather.main?.temp ?? 0;
    const humidity = currentWeather.main?.humidity ?? 0;

    if (rain > 60) {
      advice.push({
        type: "warning",
        text: "High chance of rain. Avoid irrigation and fertilizer use.",
      });
    } else if (rain > 30) {
      advice.push({
        type: "caution",
        text: "Moderate rain expected. Irrigate only if soil is dry.",
      });
    } else {
      advice.push({
        type: "success",
        text: "Low rain probability. Irrigation is recommended.",
      });
    }

    if (temp > 35) {
      advice.push({
        type: "warning",
        text: "High temperature. Provide shade and irrigate early morning.",
      });
    } else if (temp < 15) {
      advice.push({
        type: "caution",
        text: "Low temperature may slow crop growth.",
      });
    } else {
      advice.push({
        type: "success",
        text: "Temperature is in a healthy range for crop growth.",
      });
    }

    if (humidity > 80) {
      advice.push({
        type: "warning",
        text: "High humidity increases fungal disease risk.",
      });
    }

    return advice;
  }, [currentWeather, forecast]);

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfdf3_0%,#f8fafc_50%,#eef2ff_100%)] p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-sm">
          Missing weather API key. Set <code>VITE_OPENWEATHER_API_KEY</code> in <code>frontend/.env</code>.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfdf3_0%,#f8fafc_50%,#eef2ff_100%)] p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-emerald-100 bg-white/80 p-8 text-center text-emerald-700 shadow-sm">
          Detecting location and loading weather...
        </div>
      </div>
    );
  }

  if (locationError || weatherError) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfdf3_0%,#f8fafc_50%,#eef2ff_100%)] p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-sm">
          {locationError || `Weather API error: ${weatherError}`}
        </div>
      </div>
    );
  }

  if (!currentWeather) return null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ecfdf3_0%,#f8fafc_50%,#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-sky-100 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            Live Weather Intelligence
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Weather Prediction</h2>
          <p className="mt-1 text-sm text-slate-600">{currentWeather.name}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
              <p className="text-xs text-slate-500">Temperature</p>
              <p className="text-xl font-semibold text-slate-900">{Math.round(currentWeather.main.temp)} C</p>
            </div>
            <div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
              <p className="text-xs text-slate-500">Feels Like</p>
              <p className="text-xl font-semibold text-slate-900">{Math.round(currentWeather.main.feels_like)} C</p>
            </div>
            <div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
              <p className="text-xs text-slate-500">Humidity</p>
              <p className="text-xl font-semibold text-slate-900">{currentWeather.main.humidity}%</p>
            </div>
            <div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
              <p className="text-xs text-slate-500">Wind</p>
              <p className="text-xl font-semibold text-slate-900">{currentWeather.wind.speed} km/h</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900">5-Day Forecast</h3>
            <p className="mt-1 text-sm text-slate-500">Daily outlook based on OpenWeather 3-hour intervals.</p>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
              {forecast.map((day, index) => (
                <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    {new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{Math.round(day.main.temp)} C</p>
                  <p className="mt-1 text-xs text-slate-500">Rain {Math.round((day.pop || 0) * 100)}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Conditions</h3>
            <p className="mt-1 text-sm capitalize text-slate-600">{currentWeather.weather?.[0]?.description}</p>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Pressure</p>
                <p className="text-lg font-semibold text-slate-900">{currentWeather.main.pressure} mb</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-xs text-slate-500">Rain Probability</p>
                <p className="text-lg font-semibold text-slate-900">{Math.round((forecast[0]?.pop || 0) * 100)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Smart Farming Recommendations</h3>
          <div className="mt-4 space-y-3">
            {farmingAdvice.map((item, index) => (
              <div
                key={index}
                className={`rounded-xl border-l-4 px-4 py-3 text-sm ${adviceTone[item.type]}`}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherSearch;
