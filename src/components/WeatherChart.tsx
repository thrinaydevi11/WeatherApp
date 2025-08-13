//weather fiveday forecast chart component


import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface ForecastDay {
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

interface WeatherChartProps {
  forecast: ForecastDay[];
}

export default function WeatherChart({ forecast }: WeatherChartProps) {
  // Convert °C strings to numbers
  const chartData = forecast.map(day => ({
    date: day.date,
    avgTemp: parseFloat(day.avgTemp), // remove °C
    minTemp: parseFloat(day.minTemp),
    maxTemp: parseFloat(day.maxTemp),
    humidity: parseFloat(day.avgHumidity), // remove %
    rainChance: parseFloat(day.chanceOfRain) // remove %
  }));

  return (
    
<ResponsiveContainer  height={400}>
      <LineChart data={chartData} className="line_chart" >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis label={{ value: "°C", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="avgTemp" stroke="#ff7300" name="Avg Temp (°C)" />
        <Line type="monotone" dataKey="minTemp" stroke="#8884d8" name="Min Temp (°C)" />
        <Line type="monotone" dataKey="maxTemp" stroke="#82ca9d" name="Max Temp (°C)" />
      </LineChart>
     
    </ResponsiveContainer>



    
  );
}
