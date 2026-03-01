import React, { useEffect, useState } from "react";

const WeatherSearch = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);

  const API_KEY = "a3df9be41ca01921607888d9bd762063";

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
        setLocationError(true);
      }
    );
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);

        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
        );
        const currentData = await currentRes.json();

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastRes.json();

        const dailyForecast = forecastData.list.filter((_, i) => i % 8 === 0);

        setCurrentWeather(currentData);
        setForecast(dailyForecast);
      } catch (error) {
        console.error("Weather fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  if (loading || !currentWeather) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        🌦 Detecting location & loading weather...
      </div>
    );
  }

  const generateFarmingAdvice = () => {
    const advice = [];

    const rain = forecast[0]?.pop * 100 || 0;
    const temp = currentWeather.main.temp;
    const humidity = currentWeather.main.humidity;

    // 🌧 Rain-based advice
    if (rain > 60) {
      advice.push({
        type: "warning",
        text: "⚠️ High chance of rain. Avoid irrigation and fertilizer use.",
      });
    } else if (rain > 30) {
      advice.push({
        type: "caution",
        text: "🌦 Moderate rain expected. Irrigate only if soil is dry.",
      });
    } else {
      advice.push({
        type: "success",
        text: "✅ Low rain probability. Irrigation recommended.",
      });
    }

    // 🌡 Temperature advice
    if (temp > 35) {
      advice.push({
        type: "warning",
        text: "🔥 High temperature. Provide shade and irrigate early morning.",
      });
    } else if (temp < 15) {
      advice.push({
        type: "caution",
        text: "❄️ Low temperature. Crop growth may slow down.",
      });
    } else {
      advice.push({
        type: "success",
        text: "🌡 Temperature is ideal for crop growth.",
      });
    }

    // 💧 Humidity advice
    if (humidity > 80) {
      advice.push({
        type: "warning",
        text: "🦠 High humidity. Risk of fungal diseases.",
      });
    }

    return advice;
  };
  const farmingAdvice =
    currentWeather && forecast.length ? generateFarmingAdvice() : [];

  if (locationError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        📍 Location access denied. Please enable GPS.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-green-800 mb-4 text-center">
        🌦 Weather Prediction
      </h2>
      <p className="text-lg opacity-80 mb-6 text-center">
        📍 {currentWeather.name}
      </p>

      <p className="text-gray-600 mb-6">Live weather & 7-day forecast</p>

      {/* ---------------- CURRENT WEATHER ---------------- */}
      <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg mb-8 flex justify-between">
        <div>
          <h1 className="text-5xl font-bold">
            {Math.round(currentWeather.main.temp)}°C
          </h1>
          <p className="text-lg capitalize">
            {currentWeather.weather[0].description}
          </p>
          <p className="text-sm opacity-80">
            Feels like {Math.round(currentWeather.main.feels_like)}°C
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <p>💧 Humidity: {currentWeather.main.humidity}%</p>
            <p>💨 Wind: {currentWeather.wind.speed} km/h</p>
            <p>🌡 Pressure: {currentWeather.main.pressure} mb</p>
          </div>
        </div>

        <div className="flex items-center text-5xl">☁️</div>
      </div>

      {/* ---------------- 7 DAY FORECAST ---------------- */}
      <h3 className="font-semibold text-green-800 mb-4">5-Day Forecast</h3>

      <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-10">
        {forecast.map((day, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-md text-center"
          >
            <p className="font-semibold">
              {new Date(day.dt_txt).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </p>
            <p className="text-3xl">🌤</p>
            <p className="text-xl font-bold">{Math.round(day.main.temp)}°</p>
            <p className="text-sm text-gray-500">🌧 {day.pop * 100}%</p>
          </div>
        ))}
      </div>

      {/* ---------------- FARMING ADVICE ---------------- */}
      <h3 className="font-semibold text-green-800 mb-3">
        🌱 Smart Farming Recommendations
      </h3>

      <div className="space-y-4">
        {farmingAdvice.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded border-l-4 ${
              item.type === "success"
                ? "bg-green-100 border-green-500"
                : item.type === "warning"
                ? "bg-red-100 border-red-500"
                : "bg-yellow-100 border-yellow-500"
            }`}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherSearch;
