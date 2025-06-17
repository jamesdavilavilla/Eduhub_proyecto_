import prisma from "@/lib/prisma";
import AttendanceChart from "./AttendanceChart";
import Image from "next/image";

const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);

  const attendanceData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  const daysOfWeek = ["Lun", "Mar", "Mier", "Jue", "Vie"];
  const attendanceMap: Record<string, { present: number; absent: number }> = {
    Lun: { present: 0, absent: 0 },
    Mar: { present: 0, absent: 0 },
    Mier: { present: 0, absent: 0 },
    Jue: { present: 0, absent: 0 },
    Vie: { present: 0, absent: 0 },
  };

  attendanceData.forEach(({ date, present }) => {
    const d = new Date(date);
    const weekday = d.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
    const mapIndex = weekday - 1; // 0 = lunes, ..., 4 = viernes

    if (weekday >= 1 && weekday <= 5) {
      const dayName = daysOfWeek[mapIndex];
      if (present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Asistencia</h1>
        <Image src="/moreDark.png" alt="..." width={20} height={20} />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
