"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";

import InputField from "../InputField";
import { examSchema, ExamSchema } from "@/lib/formValidationSchemas";
import { createExam, updateExam } from "@/lib/actions";

const ExamForm = ({
  type,
  data,
  setOpen,
  relatedData
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema)
  });

  const [state, formAction] = useFormState(
    type === "create" ? createExam : updateExam,
    { success: false, error: false }
  );

  const router = useRouter();

  const onSubmit = handleSubmit((formData) => {
    if (type === "update") formData.id = data?.id?.toString();
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast(`El examen ha sido ${type === "create" ? "creado" : "actualizado"} correctamente`);
      setOpen(false);
      router.refresh();
    }
  }, [state]);

  const lessons = relatedData?.lessons || [];

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Crear examen" : "Actualizar examen"}
      </h1>

      <InputField
        label="Título"
        name="title"
        defaultValue={data?.title}
        register={register}
        error={errors?.title}
      />

      <InputField
        label="Hora de inicio"
        name="startTime"
        type="datetime-local"
        defaultValue={data?.startTime?.toISOString?.().slice(0, 16) || ""}
        register={register}
        error={errors?.startTime}
      />

      <InputField
        label="Hora de finalización"
        name="endTime"
        type="datetime-local"
        defaultValue={data?.endTime?.toISOString?.().slice(0, 16) || ""}
        register={register}
        error={errors?.endTime}
      />

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Lección</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("lessonId")}
          defaultValue={data?.lessonId?.toString() || ""}
        >
          <option value="">Selecciona una lección</option>
          {lessons.map((lesson: { id: number; name: string }) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.name}
            </option>
          ))}
        </select>
        {errors.lessonId?.message && (
          <p className="text-xs text-red-400">{errors.lessonId.message}</p>
        )}
      </div>

      {type === "update" && (
        <InputField
          label="ID"
          name="id"
          defaultValue={data?.id}
          register={register}
          error={errors?.id}
          hidden
        />
      )}

      {state.error && <span className="text-red-500 text-sm">¡Ocurrió un error!</span>}

      <button className="bg-blue-500 text-white p-2 rounded-md">
        {type === "create" ? "Crear" : "Actualizar"}
      </button>
    </form>
  );
};

export default ExamForm;
