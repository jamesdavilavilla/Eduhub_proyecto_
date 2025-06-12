'use server';
import { revalidatePath } from "next/cache"
import { ClassSchema, SubjectSchema,LessonSchema, AssignmentSchema, TeacherSchema } from "./formValidationSchemas"
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
    // Instanciar Clerk correctamente
    const client = await clerkClient();
    const user = await client.users.createUser({
      firstName: data.name,
      lastName: data.surname,
      username: data.username!,
      emailAddress: [data.email!],
      password: data.password!,
    });

    // Guardar en la base con valores seguros
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

  if(!data.id){
    return {success:false,error:true}
  }
  try {
    // Instanciar Clerk correctamente
    const client = await clerkClient();
    const user = await client.users.updateUser(data.id,{
      firstName: data.name,
      lastName: data.surname,
      username: data.username!,
      ...(data.password!=="" && {password:data.password}),
    });

    // Guardar en la base con valores seguros
    await prisma.teacher.update({
      where:{
        id:data.id
      },
      data: {
        ...(data.password!=="" && {password:data.password}),
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

    // revalidatePath("/list/teacher")
    return { success: true, error: false }

  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}

export const deleteTeacher = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string
  try {
    await prisma.teacher.delete({
      where: {
        id,
      },
    })
    // revalidatePath("/list/teacher  ")
    return { success: true, error: false }

  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}