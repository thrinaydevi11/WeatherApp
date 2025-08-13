import  { useState } from 'react';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import axios from 'axios';
import { getCurrentWeather, getFiveDayForecast } from './components/WeatherUtils';
import type { CurrentWeather, ForecastDay } from './components/WeatherUtils';
import WeatherChart from './components/WeatherChart';
import OneDayWeatherPie from './components/WeatherPieChart';
import './App.css';

// Import the API key from environment variables
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function App() {
  const [city, setCity] = useState<string>('');
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFiveDay, setShowFiveDay] = useState<boolean>(false);

  const fetchCoordinates = async (cityName: string): Promise<[number, number] | null> => {
    try {
      const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
      const response = await axios.get(geoUrl);

      if (!response.data || response.data.length === 0) {
        setError('Location not found.');
        return null;
      }
      return [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
    } catch (err) {
      console.error('Error fetching location data:', err);
      setError('Error fetching location data.');
      return null;
    }
  };

  const checkWeather = async (cityName: string) => {
    setError(null);
    setForecast([]);
    setCurrentWeather(null);
    setShowFiveDay(false);

    const coords = await fetchCoordinates(cityName);
    if (!coords) return;

    const [lat, lon] = coords;

    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const response = await axios.get(weatherUrl);

      if (!response.data || !response.data.list) {
        setError('No forecast data found.');
        return;
      }

      const processedForecast = getFiveDayForecast(response.data.list);
      if (Array.isArray(processedForecast)) {
        setForecast(processedForecast);
      } else {
        setError((processedForecast as any).error || 'Error processing forecast data.');
      }

      const processedCurrent = getCurrentWeather(response.data.list[0]);
      if ('error' in processedCurrent) {
        setError(processedCurrent.error);
      } else {
        setCurrentWeather(processedCurrent);
      }
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Error fetching weather data.');
    }
  };

  const getWeatherIcon = (desc: string) => {
    if (currentWeather?.weatherData && currentWeather.weatherData.length > 0) {
      const icon = currentWeather.weatherData[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      return <img src={iconUrl} alt={desc} style={{ width: 50, height: 50 }} />;
    }
    return null;
  };

  return (
    <div className="div_container">
      <h1>Weather App</h1>
      <p>Enter a city to get the weather forecast.</p>
      <Input
        placeholder="Enter city or address"
        value={city}
        onChange={e => setCity(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 10px',
          fontSize: '1rem',
          marginBottom: 15,
          borderRadius: 4,
          border: '1px solid #ccc',
          boxSizing: 'border-box',
          backgroundColor: 'white',
          color: 'black',
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => checkWeather(city)}
        style={{ width: '100%', padding: '12px', fontSize: '1rem', marginBottom: 15 }}
      >
        Check
      </Button>

      {error && <p style={{ color: 'red', fontStyle: 'italic' }}>{error}</p>}

      {currentWeather && (
        <p
          style={{
            cursor: 'pointer',
            color: '#ffdd57',
            textDecoration: 'underline',
            marginTop: 10,
            fontWeight: 'bold',
          }}
          onClick={() => setShowFiveDay(!showFiveDay)}
        >
          {showFiveDay ? 'Show Current Day Weather' : 'Want 5-day weather analysis? Click here'}
        </p>
      )}

      {!showFiveDay && currentWeather && (
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <h2>
            Current Weather for {city} {getWeatherIcon(currentWeather.description)}
          </h2>
          <p style={{ fontSize: 24, margin: 8 }}>
            <strong>Temperature:</strong> {currentWeather.temperature}
          </p>
          <p>
            <strong>Description:</strong> {currentWeather.description}
          </p>
          <p>
            <strong>Humidity:</strong> {currentWeather.humidity}
          </p>
          <p>
            <strong>Clouds:</strong> {currentWeather.clouds}
          </p>
          <p>
            <strong>Wind Speed:</strong> {currentWeather.windSpeed}
          </p>
          <p>
            <strong>Chance of Rain:</strong> {currentWeather.chanceOfRain}
          </p>

          <OneDayWeatherPie
            humidity={parseFloat(currentWeather.humidity)}
            rainChance={parseFloat(currentWeather.chanceOfRain)}
          />
        </div>
      )}

      {showFiveDay && forecast.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2>Five-Day Forecast for {city}</h2>
          <WeatherChart forecast={forecast} />
        </div>
      )}
    </div>
  );
}
