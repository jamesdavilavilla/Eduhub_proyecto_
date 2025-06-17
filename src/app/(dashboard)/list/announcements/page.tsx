import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import FormModal from "@/components/FormModal";
import { Announcement, Class, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/FormContainer";

type AnnouncementList = Announcement & { class: Class | null };

const columns = (role: string | undefined) => [
  { header: "Título", accessor: "title" },
  { header: "Clase", accessor: "class" },
  {
    header: "Fecha",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  ...(role === "admin"
    ? [
        {
          header: "Acciones",
          accessor: "action",
        },
      ]
    : []),
];

const renderRow = (item: AnnouncementList, role: string | undefined) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-EduhubPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.title}</td>
    <td>{item.class?.name || "-"}</td>
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("es-ES").format(item.date)}
    </td>
    {role === "admin" && (
      <td>
        <div className="flex items-center gap-2">
          <FormContainer table="announcement" type="update" data={item} />
          <FormContainer table="announcement" type="delete" id={item.id} />
        </div>
      </td>
    )}
  </tr>
);

const AnnouncementListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Obtener rol e ID del usuario
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = sessionClaims?.sub;

  // Construir query
  const query: Prisma.AnnouncementWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  // Restricciones según rol
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  query.OR = [
    { classId: null },
    {
      class: roleConditions[role as keyof typeof roleConditions] || {},
    },
  ];

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.announcement.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Todos Los Anuncios
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-EduhubBlue">
              <Image src="/filter.png" alt="Ícono de filtro" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-EduhubBlue">
              <Image src="/sort.png" alt="Ícono de orden" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="announcement" type="create" />}
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

export default AnnouncementListPage;
