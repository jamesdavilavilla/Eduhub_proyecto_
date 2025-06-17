"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { studentSchema, StudentSchema, teacherSchema, TeacherSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createStudent, createTeacher, updateStudent, updateTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from 'next-cloudinary';




const StudentForm = ({
    type,
    data,
    setOpen,
    relatedData,
}:{
    type:"create" | "update"; 
    data?:any;
    setOpen:Dispatch<SetStateAction<boolean>>;
    relatedData?:any
}) => {
            const{
            register,
            handleSubmit,
            formState: { errors },
        } = useForm<StudentSchema>({
            resolver: zodResolver(studentSchema)
        });

    const [img,setImg] = useState<any>()
const [state,formAction] = useFormState(type==="create"?createStudent: updateStudent,{success:false,error:false})

const onsubmit = handleSubmit(data=>{
    console.log(data);
    formAction({...data,img:img?.secure_url})
});

const router = useRouter()

 useEffect(()=>{
if(state.success){
    toast(`El Estudiante ha sido ${type==="create" ? "created": "updated"}!`);
    setOpen(false);
    router.refresh();
}
 },[state])

 const {grades,classes} = relatedData;
    return (
        <form className="flex flex-col gap-8" onSubmit={onsubmit}>
            <h1 className="text-xl font-semibold">{type === "create" ? "Crear un nuevo Estudiante": "Actualizar el Estudiante"}</h1>
            <span className="text-xs text-gray-400 font-medium">Informacion de autenticacion</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField 
                label="Username"
                name="username" 
                defaultValue={data?.username}
                register={register} 
                error={errors?.username}/>
                <InputField 
                label="Email"
                name="email"
                type="email" 
                defaultValue={data?.email}
                register={register} 
                error={errors?.email}/>
                <InputField 
                label="Password"
                name="password" 
                type="password"
                defaultValue={data?.password}
                register={register} 
                error={errors?.password}/>
            </div>

                <span className="text-xs text-gray-400 font-medium">Informacion personal</span>
             <div className="flex justify-between flex-wrap gap-4">

                <InputField 
                label="Nombre"
                name="name" 
                defaultValue={data?.name}
                register={register} 
                error={errors?.name}/>
                <InputField 
                label="Apellido"
                name="surname" 
                defaultValue={data?.surname}
                register={register} 
                error={errors?.surname}/>
                <InputField 
                label="Celular"
                name="phone" 
                defaultValue={data?.phone}
                register={register} 
                error={errors?.phone}/>
                <InputField 
                label="Direccion"
                name="address" 
                defaultValue={data?.address}
                register={register} 
                error={errors?.address}/>
                <InputField 
                label="Tipo de sangre"
                name="bloodType" 
                defaultValue={data?.bloodType}
                register={register} 
                error={errors?.bloodType}/>
                <InputField 
                label="Fecha de nacimiento"
                name="birthday" 
                defaultValue={data?.birthday.toISOString().split("T")[0]}
                register={register} 
                error={errors?.birthday}
                type="date"
                />
                <InputField 
                label="Pariente"
                name="parentId" 
                defaultValue={data?.parentId}
                register={register} 
                error={errors?.parentId}    
                />
                {data &&(
                    <InputField label="Id" name="id" defaultValue={data?.id} register={register}error={errors?.id}hidden/>
                )}
            <div className="flex flex-col gap-2 w-full md:w-1/4">
             <label className="text-xs text-gray-500">sexo</label>
             <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"{...register("sex")} defaultValue={data?.sex}>
                <option value="MALE">Hombre</option>
                <option value="FEMALE">Mujer</option>

             </select>
             {errors.sex?.message && (
                <p className="text-xs text-red-400">
                    {errors.sex.message.toString()}
                </p>
             )}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4">
             <label className="text-xs text-gray-500">Grado</label>
             <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"{...register("gradeId")} defaultValue={data?.grade}>
             {grades.map((grade:{id:number;level:number})=>(
                <option value={grade.id} key={grade.id}>{grade.level}</option>
             ))}
             </select>
             {errors.gradeId?.message && (
                <p className="text-xs text-red-400">
                    {errors.gradeId.message.toString()}
                </p>
             )}
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4">
             <label className="text-xs text-gray-500">Clase</label>
             <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"{...register("classId")} defaultValue={data?.classId}>
             {classes.map((classItem:{id:number;name:string; capacity:number;_count:{students:number}})=>(
                <option value={classItem.id} key={classItem.id}>({classItem.name} - {classItem._count.students + "/" + classItem.capacity}{" "}capacidad)</option>
             ))}
             </select>
             {errors.gradeId?.message && (
                <p className="text-xs text-red-400">
                    {errors.gradeId.message.toString()}
                </p>
             )}
            </div>
            <CldUploadWidget uploadPreset="school" onSuccess={(result,{widget})=>{
                setImg(result.info),
                widget.close()
            }}>
              {({ open }) => {
                  return (
                     <div className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" onClick={()=>open()}>
                         <Image src="/upload.png "alt="" width={28} height={28}></Image>
                         <span>Subir Foto</span>
                      </div>
    );
  }}
</CldUploadWidget>

            </div>
{state.error && <span className="text-red-500">ERROR!</span>}

            <button className="bg-blue-400 text-white p-2 rounded-md">{type==="create" ? "Create" : "Update"}</button>

        </form>
    )
}


export default StudentForm