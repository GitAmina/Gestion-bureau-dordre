"use client";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

interface Courrier {
  id: number;
  reference: string;
  type: string;
  expediteur: string;
  destinataire: string;
  etat: string;
  dateReception?: string;
  dateEnvoi?: string;
  departement?: { nom: string };
}

export default function Courriers() {
  const [courriers, setCourriers] = useState<Courrier[]>([]);

  useEffect(() => {
    fetch("/api/courriers")
      .then((res) => res.json())
      .then((data) => {
        console.log("Données récupérées : ", data); // Voir ce que tu récupères
        if (Array.isArray(data)) {
          setCourriers(data); // Si les données sont bien un tableau
        } else {
          console.error("Format des données incorrect");
        }
      })
      .catch((err) => console.error("Erreur de chargement:", err));
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Liste des courriers" />
      <div>
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              <th className="border border-gray-300 px-4 py-4">Référence</th>
              <th className="border border-gray-300 px-4 py-4">Type</th>
              <th className="border border-gray-300 px-4 py-4">Expéditeur</th>
              <th className="border border-gray-300 px-4 py-4">Destinataire</th>
              <th className="border border-gray-300 px-4 py-4">État</th>
              <th className="border border-gray-300 px-4 py-4">Département</th>
              <th className="border border-gray-300 px-4 py-4">
                {" "}
                Date Réception
              </th>
              <th className="border border-gray-300 px-4 py-4">Date Envoi</th>
            </tr>
          </thead>
          <tbody>
            {courriers.map((courrier, index) => (
              <tr
                key={courrier.id}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="border border-gray-300 px-4 py-4">
                  {courrier.reference}
                </td>
                <td className="border border-gray-300 px-4 py-4">
                  {courrier.type}
                </td>
                <td className="border border-gray-300 px-4 py-4">
                  {courrier.expediteur}
                </td>
                <td className="border border-gray-300 px-4 py-4">
                  {courrier.destinataire}
                </td>
                <td className="text-{courrier.etat === 'Urgent' ? 'red-600' : 'green-600'} border border-gray-300 px-4 py-4 font-bold">
                  {courrier.etat}
                </td>
                <td className="border border-gray-300 px-4 py-4">
                  {courrier.departement?.nom || "-"}
                </td>
                <td className="border border-gray-300 px-4 py-4">
                  {courrier.dateReception || "-"}
                </td>
                <td className="border border-gray-300 px-4 py-4">
                  {courrier.dateEnvoi || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
}
