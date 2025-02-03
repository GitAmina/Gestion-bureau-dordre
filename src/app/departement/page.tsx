// src/app/departement/page.tsx
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

interface Departement {
  id: number;
  nom: string;
  description: string;
  responsable_username: string; // Nouveau champ
  responsable_role: string; // Nouveau champ
}

export default function Departements() {
  const [departement, setDepartement] = useState<Departement[]>([]);

  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const response = await fetch("/api/departement");
        const data = await response.json();
        setDepartement(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des départements:",
          error,
        );
        toast.error(
          "Une erreur est survenue lors du chargement des départements.",
        );
      }
    };

    fetchDepartements();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Liste des departements" />
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="max-w-full overflow-x-auto">
          <div className="mb-4 flex justify-end">
            <Link href="/departement/ajouter">
              <button className="rounded-lg bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-500">
                Ajouter un département
              </button>
            </Link>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#F7F9FC] dark:bg-dark-2">
                <th className="bg-center px-4 py-4 font-medium text-dark dark:text-white">
                  Nom
                </th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">
                  Description
                </th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">
                  Username du Responsable
                </th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">
                  Role du Responsable
                </th>
              </tr>
            </thead>
            <tbody>
              {departement.map((dep) => (
                <tr key={dep.id}>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {dep.nom}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {dep.description || "N/A"}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {dep.responsable_username || "N/A"}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {dep.responsable_role || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
}
