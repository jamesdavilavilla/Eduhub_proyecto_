// ✅ src/app/list/attendance/page.tsx

import AttendanceTable from "@/components/AttendanceTable";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function AttendanceListPage({
  searchParams,
}: {
  searchParams: { month?: string; classId?: string; subjectId?: string };
}) {
  const now = new Date();
  const month = searchParams.month ? parseInt(searchParams.month) : now.getMonth();
  const year = now.getFullYear();
  const classId = searchParams.classId ? parseInt(searchParams.classId) : undefined;
  const subjectId = searchParams.subjectId ? parseInt(searchParams.subjectId) : undefined;

  // ✅ Obtener el rol del usuario logueado
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const editable = role === "admin" || role === "teacher";

  // Obtener datos para filtros
  const classes = await prisma.class.findMany({ select: { id: true, name: true } });
  const subjects = await prisma.subject.findMany({ select: { id: true, name: true } });

  // Estudiantes de la clase seleccionada
  const students = await prisma.student.findMany({
    where: classId ? { classId } : {},
  });

  // Lecciones filtradas por clase y materia
  const lessons = await prisma.lesson.findMany({
    where: {
      ...(classId && { classId }),
      ...(subjectId && { subjectId }),
    },
  });

  // Asistencias del mes
  const attendances = await prisma.attendance.findMany({
    where: {
      date: {
        gte: new Date(year, month, 1),
        lt: new Date(year, month + 1, 1),
      },
      lessonId: { in: lessons.map((l) => l.id) },
    },
  });

  // ✅ Mapeo enum Day a número de día de la semana (0-domingo a 6-sábado)
  const dayEnumToWeekday: Record<string, number> = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
  };

  // Días activos del mes según lecciones
  const activeWeekdays = new Set(
    lessons.map((l) => dayEnumToWeekday[l.day as keyof typeof dayEnumToWeekday])
  );

  // Días válidos del mes en que hay clase
  const lessonDays = Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => i + 1)
    .map((d) => new Date(year, month, d))
    .filter((d) => activeWeekdays.has(d.getDay()))
    .map((d) => d.getDate());

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Asistencia por Clase</h1>

      <form method="get" className="flex items-center gap-4 flex-wrap">
        <select name="classId" defaultValue={classId} className="border p-2 rounded">
          <option value="">Selecciona una clase</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select name="subjectId" defaultValue={subjectId} className="border p-2 rounded">
          <option value="">Selecciona una materia</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select name="month" defaultValue={month} className="border p-2 rounded">
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("es", { month: "long" })}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Filtrar
        </button>
      </form>

      {classId && subjectId && (
        <AttendanceTable
          students={students}
          attendances={attendances}
          year={year}
          month={month}
          lessons={lessons}
          subjectId={subjectId}
          lessonDays={lessonDays}
          editable={editable} // 👈 aquí va el control
        />
      )}
    </div>
  );
}
