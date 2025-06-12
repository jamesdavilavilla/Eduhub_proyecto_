"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { assignmentSchema, AssignmentSchema } from "@/lib/formValidationSchemas";
import { createAssignment, updateAssignment } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AssignmentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: {
    lessons: { id: number; name: string }[];
  };
}) => {
  const [state, setState] = useState({ success: false, error: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: data || {},
  });

  const onSubmit = async (formData: AssignmentSchema) => {
    const processedData = {
      ...formData,
      startDate: formData.startDate.trim(),
      dueDate: formData.dueDate.trim(),
    };

    const actionFn = type === "create" ? createAssignment : updateAssignment;
    const result = await actionFn({ success: false, error: false }, processedData);
    setState(result);
  };

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`La asignación ha sido ${type === "create" ? "creada" : "actualizada"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, setOpen, router, type]);

  const { lessons = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Crear nueva asignación" : "Actualizar asignación"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Título"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />

        <InputField
          label="Fecha de inicio"
          name="startDate"
          type="datetime-local"
          defaultValue={data?.startDate}
          register={register}
          error={errors?.startDate}
        />

        <InputField
          label="Fecha de entrega"
          name="dueDate"
          type="datetime-local"
          defaultValue={data?.dueDate}
          register={register}
          error={errors?.dueDate}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lección</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.lessonId || ""}
          >
            <option value="">Selecciona una lección</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">{errors.lessonId.message.toString()}</p>
          )}
        </div>

        {data?.id && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id.toString()}
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

export default AssignmentForm;
