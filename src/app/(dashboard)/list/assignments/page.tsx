import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { Assignment, Class, Subject, Teacher } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import FormContainer from "@/components/FormContainer";
import { auth } from "@clerk/nextjs/server";

// Tipado extendido
type AssignmentList = Assignment & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

// Columnas
const columns = (role: string | undefined) => [
  { header: "Título", accessor: "title" },
  { header: "Materia", accessor: "subject" },
  {
    header: "Fecha de inicio",
    accessor: "startDate",
    className: "hidden md:table-cell",
  },
  {
    header: "Fecha de vencimiento",
    accessor: "dueDate",
    className: "hidden md:table-cell",
  },
  ...(role === "admin" || role === "teacher"
    ? [{ header: "Acciones", accessor: "action" }]
    : []),
];

// Fila
const renderRow = (item: AssignmentList, role: string | undefined) => (
  <tr
    key={item.id}
    className="border-b even:bg-slate-50 text-sm hover:bg-EduhubPurpleLight"
  >
    <td className="p-2">{item.title}</td>
    <td>{item.lesson.subject.name}</td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("es-ES").format(new Date(item.startDate))}
    </td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("es-ES").format(new Date(item.dueDate))}
    </td>
    {(role === "admin" || role === "teacher") && (
      <td>
        <div className="flex gap-2">
          <FormContainer table="assignment" type="update" data={item} />
          <FormContainer table="assignment" type="delete" id={item.id} />
        </div>
      </td>
    )}
  </tr>
);

// Página principal
const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const { sessionClaims } = await auth();
  const userId = sessionClaims?.sub;
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const query: any = {
    lesson: {},
  };

  if (queryParams.search) {
    query.title = { contains: queryParams.search, mode: "insensitive" };
  }

  // Filtro por rol
  if (role === "teacher") {
    query.lesson.teacherId = userId;
  } else if (role === "student") {
    query.lesson.class = { students: { some: { id: userId } } };
  } else if (role === "parent") {
    query.lesson.class = { students: { some: { parentId: userId } } };
  }

  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: true,
            class: true,
            teacher: true,
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.assignment.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Todas las asignaciones
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-EduhubBlue">
              <Image src="/filter.png" alt="Filtro" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-EduhubBlue">
              <Image src="/sort.png" alt="Ordenar" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="assignment" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* LISTA */}
      <Table
        columns={columns(role)}
        renderRow={(item) => renderRow(item, role)}
        data={data}
      />

      {/* PAGINACIÓN */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AssignmentListPage;
