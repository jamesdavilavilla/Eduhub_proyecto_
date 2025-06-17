"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import InputField from "../InputField";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { createResult, updateResult } from "@/lib/actions";

const ResultForm = ({
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
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema)
  });

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    { success: false, error: false }
  );

  const router = useRouter();

  const onSubmit = handleSubmit((formData) => {
    if (type === "update") formData.id = data?.id?.toString();
    formAction(formData);
  });

  useEffect(() => {
    if (state.success) {
      toast(`El resultado ha sido ${type === "create" ? "creado" : "actualizado"} correctamente`);
      setOpen(false);
      router.refresh();
    }
  }, [state]);

  // ✅ Arreglo: fallback por si relatedData no existe
  const { exams = [], assignments = [], students = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Crear resultado" : "Actualizar resultado"}
      </h1>

      <InputField
        label="Puntaje"
        name="score"
        type="number"
        defaultValue={data?.score}
        register={register}
        error={errors?.score}
      />

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Estudiante</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("studentId")}
          defaultValue={data?.studentId || ""}
        >
          <option value="">Selecciona un estudiante</option>
          {students.map((student: { id: string; name: string; surname: string }) => (
            <option key={student.id} value={student.id}>
              {student.name} {student.surname}
            </option>
          ))}
        </select>
        {errors.studentId?.message && (
          <p className="text-xs text-red-400">{errors.studentId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Examen (opcional)</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("examId")}
          defaultValue={data?.examId?.toString() || ""}
        >
          <option value="">Selecciona un examen</option>
          {exams.map((exam: { id: number; title: string }) => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>
        {errors.examId?.message && (
          <p className="text-xs text-red-400">{errors.examId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Asignación (opcional)</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("assignmentId")}
          defaultValue={data?.assignmentId?.toString() || ""}
        >
          <option value="">Selecciona una asignación</option>
          {assignments.map((assignment: { id: number; title: string }) => (
            <option key={assignment.id} value={assignment.id}>
              {assignment.title}
            </option>
          ))}
        </select>
        {errors.assignmentId?.message && (
          <p className="text-xs text-red-400">{errors.assignmentId.message}</p>
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

export default ResultForm;
