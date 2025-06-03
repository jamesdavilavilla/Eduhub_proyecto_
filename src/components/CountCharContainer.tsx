import Image from "next/image";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  });

  const boys = data.find((d) => d.sex === "MALE")?._count || 0;
  const girls = data.find((d) => d.sex === "FEMALE")?._count || 0;

  const total = boys + girls;
  const boysPercent = total ? Math.round((boys / total) * 100) : 0;
  const girlsPercent = total ? Math.round((girls / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITULO */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Estudiantes</h1>
        <Image src="/moreDark.png" alt="Opciones" width={20} height={20} />
      </div>

      {/* GRAFICO */}
      <CountChart boys={boys} girls={girls} />

      {/* PIE DE INFO */}
      <div className="flex justify-center gap-16 mt-4">
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-EduhubSky rounded-full" />
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-400">
            Hombres ({boysPercent}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <div className="w-5 h-5 bg-EduhubBlue rounded-full" />
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-xs text-gray-400">
            Mujeres ({girlsPercent}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
