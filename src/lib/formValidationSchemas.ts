import { z } from "zod";

export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, {message:'El nombre es requerido!'}),
    teachers:z.array(z.string()), //teacher ids
});

export type SubjectSchema = z.infer<typeof subjectSchema>;


export const classSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, {message:'El nombre es requerido!'}),
    gradeId: z.coerce.number().min(1, {message:'El grado es requerido!'}),
    supervisorId: z.coerce.string().optional(),
    capacity: z.coerce.number().min(1, "Capacidad mínima de 1"),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const lessonSchema = z.object({
  id: z.number().optional(), // usualmente el id es opcional en creación
  name: z.string().min(1, { message: "El nombre es requerido!" }),
  day: z.enum(
    ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    { message: "El día es requerido!" }
  ),
  startTime: z.string().min(1, { message: "La hora de inicio es requerida!" }),
  endTime: z.string().min(1, { message: "La hora de fin es requerida!" }),
  subjectId: z.coerce.number().min(1, { message: "La materia es requerida!" }),
  classId: z.coerce.number().min(1, { message: "La clase es requerida!" }),
  teacherId: z.string().min(1, { message: "El profesor es requerido!" }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

export const assignmentSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "El título es requerido!" }),
  startDate: z.string().min(1, { message: "La fecha de inicio es requerida!" }),
  dueDate: z.string().min(1, { message: "La fecha de entrega es requerida!" }),
  lessonId: z.coerce.number().min(1, { message: "La lección es requerida!" }),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;


export const teacherSchema = z.object({
  id:z.string().optional(),
    username: z.string()
    .min(3, {message:'El usuario debe tener mas de 3 caracteres!'})
    .max(20, {message:'El usuario debe tener menos de 20 caracteres!'}),
    email: z.string().email({message:"Correo electronico invalido"}).optional().or(z.literal("")),
    password:z.string().min(8,{message:"La contraseña debe tener  mas de 8 caracteres!"}).or(z.literal("")).optional(),
    name:z.string().min(1,{message:"El primer nombre es requerido!"}),
    surname:z.string().min(1,{message:"El apellido es requerido!"}),
    phone:z.string().optional(),
    address:z.string(),
    bloodType:z.string().min(1,{message:"El tipo de sangre es requerida!"}),
    birthday:z.coerce.date({message:"La fecha de nacimiento es requerida"}),
    sex: z.enum(["FEMALE","MALE"],{message:"el sexo es requerido!"}),
    img:z.string().optional(),
    subjects:z.array(z.string()).optional(),//SUBJECT IDS 
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id:z.string().optional(),
    username: z.string()
    .min(3, {message:'El usuario debe tener mas de 3 caracteres!'})
    .max(20, {message:'El usuario debe tener menos de 20 caracteres!'}),
    email: z.string().email({message:"Correo electronico invalido"}).optional().or(z.literal("")),
    password:z.string().min(8,{message:"La contraseña debe tener  mas de 8 caracteres!"}).or(z.literal("")).optional(),
    name:z.string().min(1,{message:"El primer nombre es requerido!"}),
    surname:z.string().min(1,{message:"El apellido es requerido!"}),
    phone:z.string().optional(),
    address:z.string(),
    bloodType:z.string().min(1,{message:"El tipo de sangre es requerida!"}),
    birthday:z.coerce.date({message:"La fecha de nacimiento es requerida"}),
    sex: z.enum(["FEMALE","MALE"],{message:"el sexo es requerido!"}),
    img:z.string().optional(),
    gradeId: z.coerce.number().min(1,{message:"el grado es requerido!"}),
    classId: z.coerce.number().min(1,{message:"la clase es requerida!"}),
    parentId: z.string().min(1,{message:"el Pariente es requerido!"}),

});

export type StudentSchema = z.infer<typeof studentSchema>;





export const parentSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(3, "Min 3 caracteres"),
  name: z.string().min(2),
  surname: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(7),
  address: z.string().min(5),
  password: z.string().optional(),
});

export type ParentSchema = z.infer<typeof parentSchema>;


export const examSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "El título es requerido"),
  startTime: z.string().min(1, "Selecciona una hora de inicio"),
  endTime: z.string().min(1, "Selecciona una hora de finalización"),
  lessonId: z.string().min(1, "Selecciona una lección"),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Debe tener al menos 3 caracteres"),
  description: z.string().min(5, "Debe tener al menos 5 caracteres"),
  date: z.string().min(1, "La fecha es obligatoria"),
  classId: z.string().optional().or(z.literal("")),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;



export const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  startTime: z.string().min(1, "La hora de inicio es obligatoria"),
  endTime: z.string().min(1, "La hora de finalización es obligatoria"),
  classId: z.string().optional(),
});

export type EventSchema = z.infer<typeof eventSchema>;

export const resultSchema = z.object({
  id: z.string().optional(),
  score: z.coerce.number().min(0, "Debe ser mayor o igual a 0"),
  examId: z.string().optional(),
  assignmentId: z.string().optional(),
  studentId: z.string().min(1, "Selecciona un estudiante"),
});

export type ResultSchema = z.infer<typeof resultSchema>;


export const attendanceSchema = z.object({
  studentId: z.coerce.number(),
  lessonId: z.coerce.number(),
  date: z.string(),
  present: z.boolean().default(false),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;