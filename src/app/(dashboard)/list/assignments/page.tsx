// imports
import { Assignment, Class, Subject, Teacher } from "@prisma/client";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import FormModal from "@/components/FormModal";
import { currentUserId, role } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import FormContainer from "@/components/FormContainer";

// tipos
type AssignmentList = Assignment & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

// columnas
const columns = [
  { header: "Título", accessor: "title" },
  { header: "Materia", accessor: "subject" },
  { header: "Fecha de inicio", accessor: "startDate", className: "hidden md:table-cell" },
  { header: "Fecha de vencimiento", accessor: "dueDate", className: "hidden md:table-cell" },
  ...(role === "admin" || role === "teacher"
    ? [{ header: "Acciones", accessor: "action" }]
    : []),
];

// fila
const renderRow = (item: AssignmentList) => (
  <tr key={item.id} className="border-b even:bg-slate-50 text-sm hover:bg-EduhubPurpleLight">
    <td className="p-2">{item.title}</td>
    <td>{item.lesson.subject.name}</td>
    <td className="hidden md:table-cell">{new Intl.DateTimeFormat("es-ES").format(new Date(item.startDate))}</td>
    <td className="hidden md:table-cell">{new Intl.DateTimeFormat("es-ES").format(new Date(item.dueDate))}</td>
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

// componente principal
const AssignmentListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: any = { lesson: {} };

  if (queryParams.search) {
    query.title = { contains: queryParams.search, mode: "insensitive" };
  }

  // filtro por rol
  switch (role) {
    case "teacher":
      query.lesson.teacherId = currentUserId!;
      break;
    case "student":
      query.lesson.class = { students: { some: { id: currentUserId! } } };
      break;
    case "parent":
      query.lesson.class = { students: { some: { parentId: currentUserId! } } };
      break;
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
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Todas las asignaciones</h1>
        <div className="flex items-center gap-4">
          <TableSearch />
          {(role === "admin" || role === "teacher") && <FormContainer table="assignment" type="create" />}
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AssignmentListPage;
