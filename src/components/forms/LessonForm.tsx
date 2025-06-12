"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { lessonSchema, LessonSchema } from "@/lib/formValidationSchemas";
import { createLesson, updateLesson } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const;

const LessonForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    teachers: { id: string; name: string; surname: string }[];
    subjects: { id: number; name: string }[];
    classes: { id: number; name: string }[];
  };
}) => {
  const [state, setState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: data || {},
  });

  const onSubmit = async (formData: LessonSchema) => {
    // Aquí enviamos startTime y endTime como strings, tal cual vienen del formulario
    const processedData = {
      ...formData,
      startTime: formData.startTime.trim(),
      endTime: formData.endTime.trim(),
    };

    const actionFn = type === "create" ? createLesson : updateLesson;
    const result = await actionFn({ success: false, error: false }, processedData);
    setState(result);
  };

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`La lección ha sido ${type === "create" ? "creada" : "actualizada"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, setOpen, router, type]);

  const { teachers = [], subjects = [], classes = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Crear una nueva lección" : "Actualizar lección"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Nombre de la lección"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Día</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("day")}
            defaultValue={data?.day || "MONDAY"}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {errors.day?.message && (
            <p className="text-xs text-red-400">{errors.day.message.toString()}</p>
          )}
        </div>

        <InputField
          label="Hora inicio"
          name="startTime"
          type="time"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
        />

        <InputField
          label="Hora fin"
          name="endTime"
          type="time"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Profesor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacherId")}
            defaultValue={data?.teacherId || ""}
          >
            <option value="">Selecciona un profesor</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} {teacher.surname}
              </option>
            ))}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">{errors.teacherId.message.toString()}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Materia</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId")}
            defaultValue={data?.subjectId || ""}
          >
            <option value="">Selecciona una materia</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">{errors.subjectId.message.toString()}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Clase</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId || ""}
          >
            <option value="">Selecciona una clase</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">{errors.classId.message.toString()}</p>
          )}
        </div>

        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id?.toString()}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
      </div>

      {state.error && <span className="text-red-500">¡Error al guardar!</span>}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Crear" : "Actualizar"}
      </button>
    </form>
  );
};

export default LessonForm;
