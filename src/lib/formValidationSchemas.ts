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
