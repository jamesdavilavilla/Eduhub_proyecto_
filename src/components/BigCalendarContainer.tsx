import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";
import { Lesson } from "@prisma/client"; // 👈 importa el tipo

const BigCalendarContainer = async ({
  type,
  id,
  parentId,
}: {
  type?: "teacherId" | "classId";
  id?: string | number;
  parentId?: string;
}) => {
  let lessons: Lesson[] = []; // ✅ tipo explícito

  if (type && id) {
    lessons = await prisma.lesson.findMany({
      where: {
        ...(type === "teacherId"
          ? { teacherId: id as string }
          : { classId: id as number }),
      },
    });
  } else if (parentId) {
    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
      include: {
        students: {
          include: {
            class: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    const allLessons = parent?.students.flatMap(
      (student) => student.class?.lessons ?? []
    );

    lessons = allLessons ?? [];
  }

  const data = lessons.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
