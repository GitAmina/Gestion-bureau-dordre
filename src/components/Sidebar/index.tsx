"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: (
          <svg
            className="fill-current text-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3H21M3 21H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="4" y="10" width="4" height="9" fill="currentColor" />
            <rect x="9" y="6" width="4" height="13" fill="currentColor" />
            <rect x="14" y="3" width="4" height="16" fill="currentColor" />
          </svg>
        ),
        label: "Statistiques",
        route: "/dashboard",
      },

      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 8H21V10H3V8ZM3 13H21V15H3V13ZM3 18H21V20H3V18Z"
              fill=""
            />
          </svg>
        ),
        label: "Courriers",
        route: "#",
        children: [
          { label: "Liste des courriers", route: "/courriers" },
          { label: "Ajouter un courrier", route: "/courriers/ajouter" },
        ],
      },

      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 3C3.44772 3 3 3.44772 3 4V7C3 7.55228 3.44772 8 4 8H20C20.5523 8 21 7.55228 21 7V4C21 3.44772 20.5523 3 20 3H4ZM5 5H19V6H5V5Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 9C3.44772 9 3 9.44772 3 10V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V10C21 9.44772 20.5523 9 20 9H4ZM5 11H19V19H5V11Z"
              fill=""
            />
            <path
              d="M9 14C8.44772 14 8 14.4477 8 15C8 15.5523 8.44772 16 9 16H15C15.5523 16 16 15.5523 16 15C16 14.4477 15.5523 14 15 14H9Z"
              fill=""
            />
          </svg>
        ),
        label: "Archive",
        route: "/archive",
      },

      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.5 13H14.71L14.24 12.53C14.85 11.58 15 10.36 14.5 9.21C14.06 8.14 13.02 7.5 11.9 7.5C10.03 7.5 8.5 8.89 8.5 10.5C8.5 12.11 10.03 13.5 11.9 13.5C12.95 13.5 13.88 13.16 14.5 12.6C14.94 13.07 15.5 13.5 15.5 13ZM11.9 12C11.17 12 10.5 11.33 10.5 10.5C10.5 9.67 11.17 9 11.9 9C12.63 9 13.3 9.67 13.3 10.5C13.3 11.33 12.63 12 11.9 12Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M23 22C23 21.4477 22.5523 21 22 21H16.41C16.08 20.45 15.51 20 14.83 20C14.1 20 13.5 20.55 13.5 21.25C13.5 21.95 14.1 22.5 14.83 22.5H16.91L18.62 24.21C18.79 24.38 18.99 24.5 19.18 24.5C19.41 24.5 19.64 24.38 19.82 24.21L21.21 22.83C21.54 22.5 21.54 21.93 21.21 21.6C20.87 21.27 20.3 21.27 19.97 21.6L18.91 22.75C18.57 22.44 18.24 22.15 17.91 21.91L17.91 21.91C17.51 21.57 16.89 21.58 16.56 21.91L14.83 20.58C14.5 20.25 14.5 19.75 14.83 19.42L15.62 18.62C15.95 18.29 16.47 18.19 16.8 18.51C17.14 18.84 17.24 19.36 16.9 19.69C16.54 20.03 16.02 20.11 15.5 19.96C14.91 19.8 14.5 19.21 14.5 18.5C14.5 17.79 14.91 17.2 15.5 17.04C16.02 16.89 16.54 16.97 16.9 17.31C17.24 17.64 17.14 18.16 16.8 18.49C16.47 18.82 15.95 18.92 15.62 19.25L14.83 19.91C14.5 20.24 14.5 20.75 14.83 21.08L16.56 22.41C16.89 22.74 17.51 22.75 17.91 22.42L19.97 21.27C20.3 21.03 20.87 21.03 21.21 21.36C21.54 21.69 21.54 22.26 21.21 22.6C20.87 22.93 20.3 22.93 19.97 22.6L18.91 21.45C18.24 22.15 17.51 22.44 17.11 22.79C16.68 23.14 16.16 23.2 15.62 22.9L15.5 22.86L15.5 22C15.5 22 15.5 22.5 15.5 22.5Z"
              fill=""
            />
          </svg>
        ),
        label: "Recherche/Filtrage",
        route: "/recherche-filtrage",
      },

      {
        icon: (
          <svg
            className="fill-current text-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3v6M12 9H6v6M12 9h6v6M6 15v6h12v-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="3" r="2" fill="currentColor" />
            <circle cx="6" cy="15" r="2" fill="currentColor" />
            <circle cx="18" cy="15" r="2" fill="currentColor" />
          </svg>
        ),
        label: "Département",
        route: "/departement",
      },

      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 2H17C18.1046 2 19 2.89543 19 4V20C19 21.1046 18.1046 22 17 22H3C1.89543 22 1 21.1046 1 20V4C1 2.89543 1.89543 2 3 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2V8H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="4" y="12" width="4" height="8" fill="currentColor" />
            <rect x="9" y="8" width="4" height="12" fill="currentColor" />
            <rect x="14" y="4" width="4" height="16" fill="currentColor" />
          </svg>
        ),
        label: "Rapports",
        route: "/rapports",
      },
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.9999 1.25C9.37654 1.25 7.24989 3.37665 7.24989 6C7.24989 8.62335 9.37654 10.75 11.9999 10.75C14.6232 10.75 16.7499 8.62335 16.7499 6C16.7499 3.37665 14.6232 1.25 11.9999 1.25ZM8.74989 6C8.74989 4.20507 10.205 2.75 11.9999 2.75C13.7948 2.75 15.2499 4.20507 15.2499 6C15.2499 7.79493 13.7948 9.25 11.9999 9.25C10.205 9.25 8.74989 7.79493 8.74989 6Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.9999 12.25C9.68634 12.25 7.55481 12.7759 5.97534 13.6643C4.41937 14.5396 3.24989 15.8661 3.24989 17.5L3.24982 17.602C3.24869 18.7638 3.24728 20.222 4.5263 21.2635C5.15577 21.7761 6.03637 22.1406 7.2261 22.3815C8.41915 22.6229 9.97412 22.75 11.9999 22.75C14.0257 22.75 15.5806 22.6229 16.7737 22.3815C17.9634 22.1406 18.844 21.7761 19.4735 21.2635C20.7525 20.222 20.7511 18.7638 20.75 17.602L20.7499 17.5C20.7499 15.8661 19.5804 14.5396 18.0244 13.6643C16.445 12.7759 14.3134 12.25 11.9999 12.25ZM4.74989 17.5C4.74989 16.6487 5.37127 15.7251 6.71073 14.9717C8.02669 14.2315 9.89516 13.75 11.9999 13.75C14.1046 13.75 15.9731 14.2315 17.289 14.9717C18.6285 15.7251 19.2499 16.6487 19.2499 17.5C19.2499 18.8078 19.2096 19.544 18.5263 20.1004C18.1558 20.4022 17.5364 20.6967 16.4761 20.9113C15.4192 21.1252 13.9741 21.25 11.9999 21.25C10.0257 21.25 8.58063 21.1252 7.52368 20.9113C6.46341 20.6967 5.84401 20.4022 5.47348 20.1004C4.79021 19.544 4.74989 18.8078 4.74989 17.5Z"
              fill=""
            />
          </svg>
        ),
        label: "Profile",
        route: "/profile",
      },
      {
        icon: (
          <svg
            className="fill-current text-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14C10 12.8954 10.8954 12 12 12Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M8 21C8 19.8954 8.89543 19 10 19H14C15.1046 19 16 19.8954 16 21V22H8V21Z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        ),
        label: "Utilisateurs",
        route: "/utilisateurs",
        visible: true, // Cet item sera affiché seulement si l'utilisateur est administrateur
        condition: (role: string) => role === "admin", // Condition d'affichage pour les administrateurs
      },
    ],
  },

  {
    name: "AUTRES",
    menuItems: [
      {
        icon: (
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8.5 0C7.678 0 7 .678 7 1.5v6c0 .665 1 .67 1 0v-6c0-.286.214-.5.5-.5h20c.286 0 .5.214.5.5v27c0 .286-.214.5-.5.5h-20c-.286 0-.5-.214-.5-.5v-7c0-.66-1-.654-1 0v7c0 .822.678 1.5 1.5 1.5h20c.822 0 1.5-.678 1.5-1.5v-27c0-.822-.678-1.5-1.5-1.5zm-4 19c.45 0 .643-.563.354-.854L1.207 14.5l3.647-3.646c.442-.426-.254-1.16-.708-.708l-4 4c-.195.196-.195.512 0 .708l4 4c.095.097.22.146.354.146zm13-4h-14c-.277 0-.5-.223-.5-.5s.223-.5.5-.5h14c.277 0 .5.223.5.5s-.223.5-.5.5z" />{" "}
          </svg>
        ),
        label: "Deconnexion",
        route: "/auth/deconnexion",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [user, setUser] = useState<{ role?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      setUser({ role: decoded.role || "user" }); // "user" par défaut si le rôle n'existe pas
    } catch (error) {
      console.error("Token invalide", error);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        {/* En-tête de la barre latérale */}
        <div className="flex items-center justify-between px-6 py-5 lg:py-6">
          <Link href="/">
            <div className="flex items-center">
              <Image
                width={50}
                height={50}
                src="/images/logo/logo.png"
                alt="Logo"
                priority
                className="h-auto w-auto"
              />
              <h1 className=" via-puprle-600 ml-3 bg-gradient-to-r from-purple-400  to-blue-500 bg-clip-text text-3xl font-bold text-transparent dark:text-white">
                OrdoDesk
              </h1>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        {/* Contenu de la barre latérale */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => {
                    // Vérifier si l'élément doit être affiché en fonction du rôle
                    if (
                      menuItem.condition &&
                      !menuItem.condition(user.role || "user")
                    ) {
                      return null; // Ne pas afficher l'élément si la condition n'est pas remplie
                    }

                    return (
                      <SidebarItem
                        key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                      />
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
