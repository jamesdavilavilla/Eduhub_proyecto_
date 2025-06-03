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