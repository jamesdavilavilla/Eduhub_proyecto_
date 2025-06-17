// ✅ src/components/AttendanceTable.tsx

"use client";

import { Attendance, Lesson, Student } from "@prisma/client";
import { useState, useTransition } from "react";
import { toggleAttendance } from "@/lib/actions";
import { utils, writeFile } from "xlsx";

type Props = {
  students: Student[];
  attendances: Attendance[];
  year: number;
  month: number;
  lessons: Lesson[];
  subjectId: number;
  lessonDays: number[];
};

export default function AttendanceTable({
  students,
  attendances: initialAttendances,
  year,
  month,
  lessons,
  subjectId,
  lessonDays,
}: Props) {
  const [attendances, setAttendances] = useState(initialAttendances);
  const [isPending, startTransition] = useTransition();

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const handleClick = (studentId: string, lessonId: number, date: Date) => {
    startTransition(async () => {
      const updated = await toggleAttendance(
        studentId,
        lessonId,
        date.toISOString()
      );

      setAttendances((prev) => {
        const same = (a: Attendance) =>
          a.studentId === studentId &&
          a.lessonId === lessonId &&
          sameDay(new Date(a.date), date);

        if (updated === null) {
          return prev.filter((a) => !same(a));
        } else {
          const filtered = prev.filter((a) => !same(a));
          return [...filtered, updated];
        }
      });
    });
  };

  const handleExport = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const rows = students.map((s) => {
      const row: any = { Estudiante: `${s.name} ${s.surname}` };
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const lesson = lessons.find(
          (l) =>
            l.classId === s.classId &&
            l.subjectId === subjectId &&
            dayEnumToWeekday[l.day as keyof typeof dayEnumToWeekday] === date.getDay()
        );
        if (!lesson) continue;

        const attendance = attendances.find(
          (a) =>
            a.studentId === s.id &&
            a.lessonId === lesson.id &&
            sameDay(new Date(a.date), date)
        );

        if (attendance) {
          row[d] = attendance.present ? "✔️" : "❌";
        } else {
          row[d] = "❌";
        }
      }
      return row;
    });

    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Asistencia");
    writeFile(wb, "Asistencia.xlsx");
  };

  const dayEnumToWeekday: Record<string, number> = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
  };

  return (
    <div className="overflow-x-auto border rounded">
      <div className="flex justify-end p-2">
        <button
          onClick={handleExport}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Exportar Excel
        </button>
      </div>
      <table className="min-w-full border-collapse text-center">
        <thead>
          <tr>
            <th className="border p-2">Estudiante</th>
            {lessonDays.map((d) => (
              <th key={d} className="border p-2">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="border p-2 text-left">
                {s.name} {s.surname}
              </td>
              {lessonDays.map((d) => {
                const date = new Date(year, month, d);
                const lesson = lessons.find(
                  (l) =>
                    l.classId === s.classId &&
                    l.subjectId === subjectId &&
                    dayEnumToWeekday[l.day as keyof typeof dayEnumToWeekday] === date.getDay()
                );

                if (!lesson) return <td key={d} className="border"></td>;

                const isPresent = attendances.some(
                  (a) =>
                    a.studentId === s.id &&
                    a.lessonId === lesson.id &&
                    sameDay(new Date(a.date), date) &&
                    a.present
                );

                return (
                  <td
                    key={d}
                    className={`border p-1 cursor-pointer transition-all duration-200 ${isPresent ? "bg-green-200" : "bg-red-200"}`}
                    onClick={() => handleClick(s.id, lesson.id, date)}
                    title="Haz clic para alternar asistencia"
                  >
                    {isPresent ? "✔️" : "❌"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {isPending && <p className="text-center my-2">Actualizando...</p>}
    </div>
  );
}