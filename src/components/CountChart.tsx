"use client";

import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const total = boys + girls;

  const data = [
    {
      name: "Total",
      count: total,
      fill: "white",
    },
    {
      name: "Mujeres", 
      count: boys,
      fill: "#7BC9FF",
    },
    {
      name: "Hombres",
      count: girls,
      fill: "#8576FF",
    },
  ];

  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={data}
        >
          <RadialBar background dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Ícono centrado */}
      <Image
        src="/maleFemale.png"
        alt="Ícono de género"
        width={50}
        height={50}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default CountChart;
