// weatherUtils.ts

// ---- Types for OpenWeather API ----
export interface WeatherEntry {
  dt_txt?: string;
  main?: {
    temp?: number;
    humidity?: number;
  };
  weather?: { description?: string; icon?: string }[];
  clouds?: { all?: number };
  wind?: { speed?: number };
  pop?: number; // Probability of precipitation (0–1)
  weatherData?: {
    description?: string;
    icon?: string;
  }[];
}

export interface CurrentWeather {
  temperature: string;
  humidity: string;
  clouds: string;
  windSpeed: string;
  description: string;
  chanceOfRain: string;
  weatherData?: {
    description?: string;
    icon?: string;
  }[];
}

export interface ForecastDay {
  date: string;
  avgTemp: string;
  minTemp: string;
  maxTemp: string;
  avgHumidity: string;
  description: string;
  chanceOfRain: string;
  avgWindSpeed: string;
  avgClouds: string;
}

export interface ErrorResponse {
  error: string;
}

// ---- Utility Functions ----
// Convert Celsius to Fahrenheit
export function celsiusToFahrenheit(celsius: string): string {
  const celsiusNum = parseFloat(celsius);
  if (isNaN(celsiusNum)) return "N/A";
  const fahrenheit = celsiusNum * 9 / 5 + 32;
  return fahrenheit.toFixed(1) + "°F";
}


// ---- Get Five-Day Forecast ----

export function getFiveDayForecast(data: WeatherEntry[]): ForecastDay[] | ErrorResponse {
  if (!Array.isArray(data) || data.length === 0) {
    return { error: "No forecast data available" };
  }
console.log('Raw weather data:', data);
  interface AggregatedData {
    temps: number[];
    humidities: number[];
    windSpeeds: number[];
    clouds: number[];
    pops: number[];
    descriptions: Record<string, number>;
  }

  const dailyData: Record<string, AggregatedData> = {};

  data.forEach(item => {
    const date = item.dt_txt?.split(" ")[0];
    if (!date) return;

    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        humidities: [],
        windSpeeds: [],
        clouds: [],
        pops: [],
        descriptions: {},
      };
    }

    if (item.main?.temp !== undefined) dailyData[date].temps.push(item.main.temp);
    if (item.main?.humidity !== undefined) dailyData[date].humidities.push(item.main.humidity);
    if (item.wind?.speed !== undefined) dailyData[date].windSpeeds.push(item.wind.speed);
    if (item.clouds?.all !== undefined) dailyData[date].clouds.push(item.clouds.all);
    if (item.pop !== undefined) dailyData[date].pops.push(item.pop);

    const desc = item.weather?.[0]?.description;
    if (desc) {
      dailyData[date].descriptions[desc] = (dailyData[date].descriptions[desc] || 0) + 1;
    }
  });

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const forecast: ForecastDay[] = Object.entries(dailyData).map(([date, values]) => {
    const mostFreqDescription = Object.entries(values.descriptions).reduce(
      (a, b) => (b[1] > a[1] ? b : a),
      ["", 0]
    )[0] || "N/A";

    const avgTemp = values.temps.length ? celsiusToFahrenheit(String(avg(values.temps))) : "N/A";
    const minTemp = values.temps.length ? celsiusToFahrenheit(String(Math.min(...values.temps))) : "N/A";
    const maxTemp = values.temps.length ? celsiusToFahrenheit(String(Math.max(...values.temps))) : "N/A";
    const avgHumidity = values.humidities.length ? avg(values.humidities).toFixed(0) : "N/A";
    const avgWindSpeed = values.windSpeeds.length ? avg(values.windSpeeds).toFixed(1) : "N/A";
    const avgClouds = values.clouds.length ? avg(values.clouds).toFixed(0) : "N/A";
    const chanceOfRain = values.pops.length
      ? `${Math.round(Math.max(...values.pops) * 100)}%`
      : "N/A";

    return {
      date,
      avgTemp,
      minTemp,
      maxTemp,
      avgHumidity: `${avgHumidity}%`,
      description: mostFreqDescription,
      chanceOfRain,
      avgWindSpeed: `${avgWindSpeed} m/s`,
      avgClouds: `${avgClouds}%`
    };
  });

  return forecast.slice(0, 5); // first 5 days
}

// ---- Get Current Weather ----
export function getCurrentWeather(data: WeatherEntry): CurrentWeather | ErrorResponse {
  if (!data || !data.main || !data.weather) {
    return { error: "Incomplete weather data" };
  }
  console.log('Current weather data:', data);
  const temperature = data.main.temp !== undefined ? celsiusToFahrenheit(String(data.main.temp)) : "N/A";
  const humidity = data.main.humidity !== undefined ? `${data.main.humidity}%` : "N/A";
  const clouds = data.clouds?.all !== undefined ? `${data.clouds.all}%` : "N/A";
  const windSpeed = data.wind?.speed !== undefined ? `${data.wind.speed.toFixed(1)} m/s` : "N/A";
  const description = data.weather[0]?.description || "N/A";
  const chanceOfRain = data.pop !== undefined ? `${Math.round(data.pop * 100)}%` : "N/A";
  const weatherData = data.weather || [];
  if (!weatherData || weatherData.length === 0) {
    return { error: "No weather description available" };
  }

  if (!weatherData || weatherData.length === 0) {
    return { error: "No weather description available" };
  }

  return {
    temperature,
    humidity,
    clouds,
    windSpeed,
    description,
    chanceOfRain,
    weatherData: weatherData.map(w => ({
      description: w.description || "N/A",
      icon: w.icon || "N/A"
    })) 
  };
}

export default {
  getCurrentWeather,
  getFiveDayForecast
};
