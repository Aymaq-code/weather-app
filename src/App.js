import { useEffect, useState } from "react";

const getWeatherIcon = (condition) => {
  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
    return process.env.PUBLIC_URL + "/assets/icons/sun.png";
  } else if (lowerCondition.includes("cloud")) {
    return process.env.PUBLIC_URL + "/assets/icons/cloudy.png";
  } else if (lowerCondition.includes("overcast")) {
    return process.env.PUBLIC_URL + "/assets/icons/overCast.png";
  } else if (lowerCondition.includes("rain")) {
    return process.env.PUBLIC_URL + "/assets/icons/rain.png";
  } else if (lowerCondition.includes("snow")) {
    return process.env.PUBLIC_URL + "/assets/icons/snow.png";
  } else if (lowerCondition.includes("mist")) {
    return process.env.PUBLIC_URL + "/assets/icons/mist.png";
  } else if (lowerCondition.includes("fog")) {
    return process.env.PUBLIC_URL + "/assets/icons/fog.png";
  } else {
    return process.env.PUBLIC_URL + "/assets/icons/default.png";
  }
};

const getLeftImage = (condition) => {
  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
    return process.env.PUBLIC_URL + "/assets/images/sunny-left.jpg";
  } else if (lowerCondition.includes("cloud")) {
    return process.env.PUBLIC_URL + "/assets/images/cloudy-left.jpg";
  } else if (lowerCondition.includes("overcast")) {
    return process.env.PUBLIC_URL + "/assets/images/overcast-left.jpg";
  } else if (lowerCondition.includes("rain")) {
    return process.env.PUBLIC_URL + "/assets/images/rainy-left.jpg";
  } else if (lowerCondition.includes("snow")) {
    return process.env.PUBLIC_URL + "/assets/images/snowy-left.jpg";
  } else if (
    lowerCondition.includes("mist") ||
    lowerCondition.includes("fog")
  ) {
    return process.env.PUBLIC_URL + "/assets/images/mist-left.jpg";
  } else {
    return process.env.PUBLIC_URL + "/assets/images/default.jpg";
  }
};

const API_KEY = "9f816d62aa65469bb3751117252406";

export default function App() {
  const [city, setCity] = useState("kabul");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setIsLoader(true);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=4`
      );

      if (!response.ok) {
        throw new Error("City not found !");
      }

      const data = await response.json();
      if (data.Response === "False")
        throw new Error("Something went wrong with fetching weather");
      setWeather(data);
      setError("");
      setCity("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    fetchWeather("Kabul");
    setCity("");
  }, []);

  useEffect(() => {
    const input = document.querySelector("input");
    if (!input) return;
    const handleKeyDown = (e) => {
      if (e.code === "Enter") {
        fetchWeather(city);
      }
    };

    input.addEventListener("keydown", handleKeyDown);

    return () => {
      input.removeEventListener("keydown", handleKeyDown);
    };
  }, [city]);

  return (
    <div className="weather">
      {weather && (
        <aside className="left">
          <div className="leftImage">
            <img
              src={getLeftImage(weather.current.condition.text)}
              alt="weather"
            />
          </div>
          <div className="left-Weather">
            <div className="left-weather-top">
              <p>City: {weather.location.name} 🌏</p>
              <p>Sunrise: {weather.forecast.forecastday[0].astro.sunrise}</p>
              <p>Time: {weather.location.localtime.split(" ")[1]}</p>
              <p>Sunset: {weather.forecast.forecastday[0].astro.sunset}</p>
            </div>

            <div className="left-weather-top-under">
              <p>UV Index: {weather.current.uv} ☀️</p>
              <p>Wind: {weather.current.wind_kph} km/h 🍃</p>
              <p>Humidity: {weather.current.humidity} %</p>
            </div>
            <div className="left-weather-end">
              <img
                className="weatherIcon-lef"
                src={getWeatherIcon(weather.current.condition.text)}
                alt="weather icon"
              />
              <p>It's a beautiful day! ⛅</p>
            </div>
          </div>
        </aside>
      )}
      <aside className="right">
        <div className="search">
          <input
            type="text"
            placeholder="Enter location name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={() => fetchWeather(city)}>
            <svg
              className="my-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {isLoader ? (
          <Loader />
        ) : error ? (
          <ErrorMsg message={error} />
        ) : (
          <>
            <SearchResult weather={weather} />
            <NextDays weather={weather} />
          </>
        )}
      </aside>
    </div>
  );
}

function SearchResult({ weather }) {
  return (
    <>
      {weather && (
        <div className="searchResult">
          <div className="location">
            <p>
              <span>{weather.location.name}</span>,
              <span> {weather.location.country}</span>
            </p>
            <span className="hash">|</span>
            <p>{weather.location.localtime}</p>
          </div>

          <div className="current">
            <p className="condition">
              {weather.current.condition.text}
              <img
                className="weatherIcon"
                src={getWeatherIcon(weather.current.condition.text)}
                alt="weather icon"
              />
            </p>
            <p>Temp: {weather.current.temp_c}°C</p>
            <p className="feels">Feels like: {weather.current.temp_f}°C</p>
          </div>
        </div>
      )}
    </>
  );
}

function NextDays({ weather }) {
  if (!weather || !weather.forecast) return null;

  return (
    <div className="nextDays">
      {weather.forecast.forecastday.map((day, index) => (
        <div key={index} className="box">
          <p className="box-date">{day.date}</p>
          <p className="box-condition">
            {day.day.condition.text}
            <img
              className="box-weatherIcon"
              src={getWeatherIcon(day.day.condition.text)}
              alt="weather icon"
            />
          </p>
          <p>Max: {day.day.maxtemp_c}°C</p>
          <p>Min: {day.day.mintemp_c}°C</p>
        </div>
      ))}
    </div>
  );
}

function Loader() {
  return (
    <div className="loader">
      <h2>Loading...</h2>
    </div>
  );
}

function ErrorMsg({ message }) {
  return (
    <div className="errorM">
      <h2>{message}</h2>
    </div>
  );
}
