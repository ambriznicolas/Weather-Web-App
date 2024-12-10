import { useEffect, useState } from "react";
import "./App.css";

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const PHOTOS_API_KEY = process.env.REACT_APP_PHOTOS_API_KEY;

function App() {
  const [getCity, setGetCity] = useState("");
  const [showTemp, setShowTemp] = useState(false);
  const [city, setCity] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchImage = async (e) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${city}&per_page=1`,
        {
          headers: {
            Authorization: PHOTOS_API_KEY, // Use your API key
          },
        },
      );

      if (!response.ok) {
        throw new Error("Error fetching image");
      }

      const data = await response.json();
      if (data.photos.length > 0) {
        setImage(data.photos[0].src.original); // Set the image URL
      } else {
        setError("No images found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    e.preventDefault();
    if (!getCity) {
      alert("Please input a valid city");
    } else {
      setShowTemp(true);
      setCity(getCity);
      fetchImage();
    }
  };

  useEffect(() => {
    if (city) {
      fetchImage(); // Fetch image whenever city changes
    }
  }, [city]);

  return (
    <div className="App">
      <body
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh", // Ensure it covers the full viewport height
          display: "flex", // Use flexbox to center content
          flexDirection: "column",
        }}
      >
        <h1 className="text-sky-500"> Nico's Forecast</h1>
        <div class="grid place-items-center pt-10">
          <div class="flex flex-row space-x-4">
            <input
              type="text"
              class="block w-full max-w-sm justify-center rounded-md border border-gray-600 border-slate-300 bg-white px-3 py-2 pr-2 text-sm placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="City Name"
              value={getCity}
              onChange={(e) => setGetCity(e.target.value)}
            />
            <button
              type="submit"
              onClick={handleCity}
              class="w-20 rounded border bg-sky-500 text-stone-50"
            >
              Enter
            </button>
          </div>
        </div>
        <>
          {showTemp && true ? <CurrentWeather city={city} /> : null}
          {/* <CurrentWeather city={city} /> */}
        </>
      </body>
    </div>
  );
}

function CurrentWeather({ city, setCity }) {
  const [info, setInfo] = useState("");
  const [temp, setTemp] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [wind, setWind] = useState("");
  const [icon, setIcon] = useState("");
  useEffect(() => {
    async function fetchCityWeather() {
      if (!city) {
        return <p>Invalid please input a valid city.</p>;
      }

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${WEATHER_API_KEY}`,
        );
        if (!res.ok) throw new "Something went wrong from fetching the data"();
        const data = await res.json();
        console.log(data.weather[0].description);

        setInfo(data.weather[0].description);
        setTemp(Math.floor(data.main.temp));
        setFeelsLike(Math.floor(data.main.feels_like));
        setWind(data.wind.speed);
        setIcon(data.weather[0].icon);
        console.log(city);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCityWeather();

    //Clean up function
    return () => {
      setInfo("");
      setTemp("");
      setFeelsLike("");
    };
  }, [city, setCity, wind]);
  return (
    <div>
      <Card
        city={city}
        temp={temp}
        info={info}
        feelsLike={feelsLike}
        wind={wind}
        icon={icon}
      />
    </div>
  );
}

function Card({ city, temp, info, feelsLike, wind, icon }) {
  return (
    <div class="mx-auto mt-10 max-w-sm overflow-hidden rounded-lg bg-white shadow-lg">
      <div class="p-6">
        <h2 class="text-center text-2xl font-bold">{city}</h2>
        <div class="my-4 flex justify-center">
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt="Weather Icon"
            class="h-24 w-24"
          />
        </div>
        <p class="text-center text-4xl text-gray-800">{temp}°F</p>
        <p class="text-center text-lg text-gray-600">{info}</p>
      </div>
      <div class="bg-gray-100 p-4">
        <div class="flex justify-between">
          <div>
            <p class="text-sm text-gray-500">Feels Like</p>
            <p class="text-lg font-semibold">{feelsLike}°F</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Wind Speed</p>
            <p class="text-lg font-semibold">{wind} mph</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
