"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useEffect, useState } from "react";

// Définition du type de courrier
interface Courrier {
  id: number;
  reference: string;
  type: "entrant" | "sortant";
  expediteur: string;
  destinataire: string;
  sujet?: string;
  etat: "En attente" | "Traité" | "Clôturé";
  date_reception?: Date;
  date_envoi?: Date;
}

export default function Courriers() {
  const [courriers, setCourriers] = useState<Courrier[]>([]);

  useEffect(() => {
    fetch("/api/courriers")
      .then((response) => response.json())
      .then((data: Courrier[]) => {
        console.log("Données reçues:", data); // Vérifie ici les données dans la console
        setCourriers(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des courriers:", error);
      });
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Liste des courriers" />
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#F7F9FC] dark:bg-dark-2">
                <th className="bg-center px-4 py-4 font-medium text-dark dark:text-white">
                  Réference
                </th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">
                  Type
                </th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">
                  Expediteur
                </th>
                <th className="font-medium text-dark dark:text-white">
                  Destinataire
                </th>

                <th className="font-medium text-dark dark:text-white">Sujet</th>
                <th className="font-medium text-dark dark:text-white">Etat</th>
                <th className="font-medium text-dark dark:text-white">
                  Date reception
                </th>
                <th className="font-medium text-dark dark:text-white">
                  Date envoie
                </th>
                <th className="font-medium text-dark dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {courriers.map((courrier) => (
                <tr key={courrier.id}>
                  <td
                    className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5 ${courrier.id === courriers.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <h5 className="text-dark dark:text-white">
                      {courrier.reference}
                    </h5>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${courrier.id === courriers.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <p className="text-dark dark:text-white">{courrier.type}</p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${courrier.id === courriers.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <p className="text-dark dark:text-white">
                      {courrier.expediteur}
                    </p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${courrier.id === courriers.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <p className="text-dark dark:text-white">
                      {courrier.destinataire}
                    </p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${courrier.id === courriers.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <p className="text-dark dark:text-white">
                      {courrier.sujet}
                    </p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${courrier.id === courriers.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <p
                      className={`inline-flex rounded-full px-3.5 py-1 text-body-sm font-medium ${
                        courrier.etat === "Clôturé"
                          ? "bg-[#219653]/[0.08] text-[#219653]"
                          : courrier.etat === "En attente"
                            ? "bg-[#D34053]/[0.08] text-[#D34053]"
                            : "bg-[#FFA70B]/[0.08] text-[#FFA70B]"
                      }`}
                    >
                      {courrier.etat}
                    </p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${courrier.id === courriers.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <p className="text-dark dark:text-white">
                      {courrier.date_reception
                        ? new Date(courrier.date_reception).toLocaleDateString(
                            "fr-FR",
                          ) +
                          " " +
                          new Date(courrier.date_reception).toLocaleTimeString(
                            "fr-FR",
                            { hour: "2-digit", minute: "2-digit" },
                          )
                        : "N/A"}
                    </p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${courrier.id === courriers.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <p className="text-dark dark:text-white">
                      {courrier.date_envoi
                        ? new Date(courrier.date_envoi).toLocaleDateString(
                            "fr-FR",
                          ) +
                          " " +
                          new Date(courrier.date_envoi).toLocaleTimeString(
                            "fr-FR",
                            { hour: "2-digit", minute: "2-digit" },
                          )
                        : "N/A"}
                    </p>
                  </td>
                  <td
                    className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5 ${courrier.id === courriers.length - 1 ? "border-b-0" : "border-b"}`}
                  >
                    <div className="flex items-center justify-end space-x-3.5">
                      <button className="hover:text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button className="hover:text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </button>
                      <button className="hover:text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <path d="M10 11v6"></path>
                          <path d="M14 11v6"></path>
                          <path d="M5 6h14l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6z"></path>
                        </svg>
                      </button>
                      <button className="hover:text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                      </button>
                    </div>
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
