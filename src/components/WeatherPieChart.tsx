//WeatherPieChart.tsx


import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface OneDayWeatherProps {
  humidity: number;     
  rainChance: number;   
}

const COLORS = ["#0088FE", "#E0E0E0"];

export default function OneDayWeatherPie({ humidity, rainChance }: OneDayWeatherProps) {
  const humidityData = [
    { name: "Humidity", value: humidity },
    { name: "Remaining", value: 100 - humidity },
  ];

  const rainData = [
    { name: "Rain Chance", value: rainChance },
    { name: "No Rain", value: 100 - rainChance },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginTop: "2rem" }}>
      <ResponsiveContainer width={200} height={200}>
        <PieChart>
          <Pie
            data={humidityData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {humidityData.map((_, index) => (
              <Cell key={`cell-humidity-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <ResponsiveContainer width={200} height={200}>
        <PieChart>
          <Pie
            data={rainData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {rainData.map((_, index) => (
              <Cell key={`cell-rain-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
