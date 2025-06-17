'use server';
import { revalidatePath } from "next/cache"
import { ClassSchema, SubjectSchema,LessonSchema, AssignmentSchema, TeacherSchema, StudentSchema, ParentSchema, ExamSchema, AnnouncementSchema, EventSchema, ResultSchema, AttendanceSchema, attendanceSchema } from "./formValidationSchemas"
import prisma from "./prisma"
import { clerkClient } from "@clerk/nextjs/server";
import { error } from "console";


type CurrentState = { success: boolean; error: boolean }

export const createSubject = async (currentState: CurrentState, data: SubjectSchema) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map(teacherId => ({ id: teacherId }))
        }
      }
    })
    // revalidatePath("/list/subjects")
    return { success: true, error: false }

  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}

export const updateSubject = async (currentState: CurrentState, data: SubjectSchema) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map(teacherId => ({ id: teacherId }))
        }
      }
    })
    // revalidatePath("/list/subjects")
    return { success: true, error: false }

  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}

export const deleteSubject = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    })
    // revalidatePath("/list/subjects")
    return { success: true, error: false }

  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}

export const createClass = async (currentState: CurrentState, data: ClassSchema) => {
  try {
    await prisma.class.create({
      data
    });
    // revalidatePath("/list/class")
    return { success: true, error: false }

  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}

export const updateClass = async (currentState: CurrentState, data: ClassSchema) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id
      },
      data
    })
    // revalidatePath("/list/class")
    return { success: true, error: false }

  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}

export const deleteClass = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    })
    // revalidatePath("/list/class")
    return { success: true, error: false }

  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}

export const createLesson = async (currentState: CurrentState, data: LessonSchema) => {
  try {
    // Convierte startTime y endTime string "HH:mm" a Date
    const [startHour, startMinute] = data.startTime.split(":").map(Number);
    const [endHour, endMinute] = data.endTime.split(":").map(Number);

    const today = new Date();
    const startTime = new Date(today);
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(today);
    endTime.setHours(endHour, endMinute, 0, 0);

    await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime,
        endTime,
        teacher: { connect: { id: data.teacherId } },
        subject: { connect: { id: data.subjectId } },
        class: { connect: { id: data.classId } },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateLesson = async (currentState: CurrentState, data: LessonSchema) => {
  try {
    // Igual conversión aquí
    const [startHour, startMinute] = data.startTime.split(":").map(Number);
    const [endHour, endMinute] = data.endTime.split(":").map(Number);

    const today = new Date();
    const startTime = new Date(today);
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(today);
    endTime.setHours(endHour, endMinute, 0, 0);

    await prisma.lesson.update({
      where: {
        id: data.id!,
      },
      data: {
        name: data.name,
        day: data.day,
        startTime,
        endTime,
        teacher: { connect: { id: data.teacherId } },
        subject: { connect: { id: data.subjectId } },
        class: { connect: { id: data.classId } },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteLesson = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;

  try {
    await prisma.lesson.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/lessons");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createAssignment = async (currentState: any, data: AssignmentSchema) => {
  try {
    const startDate = new Date(data.startDate);
    const dueDate = new Date(data.dueDate);

    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate,
        dueDate,
        lesson: { connect: { id: data.lessonId } },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error al crear asignación:", err);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (currentState: any, data: AssignmentSchema) => {
  try {
    const startDate = new Date(data.startDate);
    const dueDate = new Date(data.dueDate);

    await prisma.assignment.update({
      where: {
        id: data.id!,
      },
      data: {
        title: data.title,
        startDate,
        dueDate,
        lesson: { connect: { id: data.lessonId } },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error al actualizar asignación:", err);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (currentState: any, formData: FormData) => {
  const id = formData.get("id") as string;

  try {
    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/assignments"); // descomenta si usas paths dinámicos
    return { success: true, error: false };
  } catch (err) {
    console.error("Error al eliminar asignación:", err);
    return { success: false, error: true };
  }
};


export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
): Promise<{ success: boolean; error: boolean }> => {
  try {
    const client = await clerkClient();
    const user = await client.users.createUser({
      firstName: data.name,
      lastName: data.surname,
      username: data.username!,
      emailAddress: [data.email!],
      password: data.password!,
    });

    // Establecer el rol en Clerk
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: "teacher",
      },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username!,
        name: data.name,
        surname: data.surname,
        email: data.email ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        img: data.img ?? null,
        bloodType: data.bloodType!,
        sex: data.sex!,
        birthday: data.birthday!,
        subjects: {
          connect:
            data.subjects?.map((subjectId) => ({
              id: parseInt(subjectId, 10),
            })) ?? [],
        },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error al crear profesor:", err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (currentState: CurrentState, data: TeacherSchema) => {
  if (!data.id) return { success: false, error: true };

  try {
    const client = await clerkClient();
    await client.users.updateUser(data.id, {
      firstName: data.name,
      lastName: data.surname,
      username: data.username!,
      ...(data.password !== "" && { password: data.password }),
    });

    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username!,
        name: data.name,
        surname: data.surname,
        email: data.email ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        img: data.img ?? null,
        bloodType: data.bloodType!,
        sex: data.sex!,
        birthday: data.birthday!,
        subjects: {
          set:
            data.subjects?.map((subjectId) => ({
              id: parseInt(subjectId, 10),
            })) ?? [],
        },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;

  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.teacher.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// STUDENT

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
): Promise<{ success: boolean; error: boolean }> => {
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    const client = await clerkClient();
    const user = await client.users.createUser({
      firstName: data.name,
      lastName: data.surname,
      username: data.username!,
      emailAddress: [data.email!],
      password: data.password!,
    });

    // Establecer el rol en Clerk
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: "student",
      },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username!,
        name: data.name,
        surname: data.surname,
        email: data.email ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        img: data.img ?? null,
        bloodType: data.bloodType!,
        sex: data.sex!,
        birthday: data.birthday!,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: String(data.parentId),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error al crear estudiante:", err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (currentState: CurrentState, data: StudentSchema) => {
  if (!data.id) return { success: false, error: true };

  try {
    const client = await clerkClient();
    await client.users.updateUser(data.id, {
      firstName: data.name,
      lastName: data.surname,
      username: data.username!,
      ...(data.password !== "" && { password: data.password }),
    });

    await prisma.student.update({
      where: { id: data.id },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username!,
        name: data.name,
        surname: data.surname,
        email: data.email ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        img: data.img ?? null,
        bloodType: data.bloodType!,
        sex: data.sex!,
        birthday: data.birthday!,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: String(data.parentId),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;

  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.student.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema
): Promise<{ success: boolean; error: boolean }> => {
  try {
    const client = await clerkClient();
    const user = await client.users.createUser({
      firstName: data.name,
      lastName: data.surname,
      username: data.username!,
      emailAddress: data.email ? [data.email] : [],
      password: data.password!,
    });

    await client.users.updateUserMetadata(user.id, {
      publicMetadata: { role: "parent" },
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email ?? "",
        phone: data.phone,
        address: data.address,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error creando padre:", err);
    return { success: false, error: true };
  }
};

export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  if (!data.id) return { success: false, error: true };

  try {
    const client = await clerkClient();
    await client.users.updateUser(data.id, {
      firstName: data.name,
      lastName: data.surname,
      username: data.username,
      ...(data.password && data.password !== "" && { password: data.password }),
    });

    await prisma.parent.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email ?? "",
        phone: data.phone,
        address: data.address,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.parent.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createExam = async (currentState: CurrentState, data: ExamSchema) => {
  try {
    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        lessonId: parseInt(data.lessonId),
      }
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (currentState: CurrentState, data: ExamSchema) => {
  try {
    await prisma.exam.update({
      where: {
        id: parseInt(data.id!),
      },
      data: {
        title: data.title,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        lessonId: parseInt(data.lessonId),
      }
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;
  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
      }
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createAnnouncement = async (currentState: CurrentState, data: AnnouncementSchema) => {
  try {
    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        classId: data.classId ? parseInt(data.classId) : null,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (currentState: CurrentState, data: AnnouncementSchema) => {
  try {
    await prisma.announcement.update({
      where: {
        id: parseInt(data.id!),
      },
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        classId: data.classId ? parseInt(data.classId) : null,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAnnouncement = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;
  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createEvent = async (currentState: CurrentState, data: EventSchema) => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        classId: data.classId ? parseInt(data.classId) : null,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateEvent = async (currentState: CurrentState, data: EventSchema) => {
  try {
    await prisma.event.update({
      where: {
        id: parseInt(data.id!),
      },
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        classId: data.classId ? parseInt(data.classId) : null,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (currentState: CurrentState, formData: FormData) => {
  const id = formData.get("id") as string;
  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createResult = async (currentState: any, data: ResultSchema) => {
  try {
    await prisma.result.create({
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: data.examId ? parseInt(data.examId) : null,
        assignmentId: data.assignmentId ? parseInt(data.assignmentId) : null,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateResult = async (currentState: any, data: ResultSchema) => {
  try {
    await prisma.result.update({
      where: {
        id: parseInt(data.id!),
      },
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: data.examId ? parseInt(data.examId) : null,
        assignmentId: data.assignmentId ? parseInt(data.assignmentId) : null,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const deleteResult = async (currentState: any, data: FormData) => {
  const id = data.get("id") as string;

  try {
    await prisma.result.delete({
      where: {
        id: parseInt(id),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error eliminando Result:", err);
    return { success: false, error: true };
  }
};

export async function toggleAttendance(
  studentId: string,
  lessonId: number,
  date: string
) {
  const parsedDate = new Date(date);

  const existing = await prisma.attendance.findFirst({
    where: {
      studentId,
      lessonId,
      date: parsedDate,
    },
  });

  if (!existing) {
    // Si no existe, crear como presente
    return await prisma.attendance.create({
      data: {
        studentId,
        lessonId,
        date: parsedDate,
        present: true,
      },
    });
  } else if (existing.present) {
    // Si ya estaba presente, marcar como ausente
    return await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        present: false,
      },
    });
  } else {
    // Si ya estaba ausente, volver a marcar como presente
    return await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        present: true,
      },
    });
  }
}