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
      count: girls,
      fill: "#7BC9FF",
    },
    {
      name: "Hombres",
      count: boys,
      fill: "#8576FF",
    },
  ];

  return (
    <div className="relative w-full h-[200px] md:h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={data}
        >
          <RadialBar
            minAngle={15}
            background
            clockWise
            dataKey="count"
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <Image
        src="/maleFemale.png"
        alt="Icono"
        width={50}
        height={50}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default CountChart;
