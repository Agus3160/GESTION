"use client";
import { ExclamationCircleIcon, PowerIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth/logout";
import { Loading } from "../global/Loading";
import Cookies from "js-cookie";
export default function SignOutButton() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogout = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setLoading(true);
    await logout();
    Cookies.remove("caja");
    Cookies.remove("cajero");
    Cookies.remove("apertura");
    router.push("/login");
  };
  return (
    <button
      onClick={handleLogout}
      className="flex text-primary-400 h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-800 p-3 text-sm font-medium hover:bg-gray-700 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <PowerIcon className="w-6" />
      <div className="hidden md:block">
        {loading ? "Cerrando Sesión..." : "Cerrar Sesión"}
      </div>
      {message && (
        <div className="flex items-center gap-2 text-red-500">
          <ExclamationCircleIcon className="w-4" />
          <span>{message}</span>
        </div>
      )}
    </button>
  );
}
