"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Datos de asistencia por día
const defaultData = [
  { name: "Lunes", present: 18, absent: 2 },
  { name: "Martes", present: 20, absent: 0 },
  { name: "Miércoles", present: 17, absent: 3 },
  { name: "Jueves", present: 19, absent: 1 },
  { name: "Viernes", present: 16, absent: 4 },
  { name: "Sábado", present: 15, absent: 5 },
  { name: "Domingo", present: 0, absent: 0 }, // Asumiendo que no hay clases
];

const AttendanceChart = ({
  data = defaultData, // Si no pasan props, usa estos por defecto
}: {
  data?: { name: string; present: number; absent: number }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "10px",
            borderColor: "lightgray",
          }}
        />
        <Legend
          align="left"
          verticalAlign="top"
          wrapperStyle={{ paddingTop: 20, paddingBottom: 40 }}
        />
        <Bar
          dataKey="present"
          fill="#8576FF"
          legendType="circle"
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="absent"
          fill="#7BC9FF"
          legendType="circle"
          radius={[10, 10, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;
