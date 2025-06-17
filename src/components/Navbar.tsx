import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const Navbar = async () => {
  const user = await currentUser();

  return (
    <div className="flex items-center justify-between p-4">
      {/* ICONOS Y USUARIO */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* Información del usuario */}
        <div className="flex flex-col text-right">
          <span className="text-xs leading-3 font-medium">{user?.fullName}</span>
          <span className="text-[10px] text-gray-500">{user?.publicMetadata?.role as string}</span>
        </div>

        {/* Avatar opcional con UserButton */}
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
