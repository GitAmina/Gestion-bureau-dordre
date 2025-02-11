"use client";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Courrier {
  id: number;
  reference: string;
  type: string;
  sujet: string;
  expediteur: string;
  destinataire: string;
  etat: string;
  date_reception?: string | null;
  date_envoi?: string | null;
  archived?: boolean;
}

const ArchivePage = () => {
  const [archivedCourriers, setArchivedCourriers] = useState<Courrier[]>([]);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await axios.get("/api/archive");
        setArchivedCourriers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des archives :", error);
      }
    };
  
    fetchArchives();
  }, []);
  
  // Fonction pour désarchiver un courrier
  const handleUnarchive = async (courrierId: number) => {
    if (!courrierId) {
      toast.error("Erreur : Identifiant du courrier manquant !");
      return;
    }
  
    try {
      const response = await axios.delete(`/api/archive?courrierId=${courrierId}`);
  
      if (response.data.success) {
        toast.success("Courrier désarchivé avec succès !");
        // Supprime immédiatement le courrier de la liste des archives
        setArchivedCourriers((prevCourriers) =>
          prevCourriers.filter((courrier) => courrier.id !== courrierId)
        );
      } else {
        toast.error(response.data.error || "Impossible de désarchiver.");
      }
    } catch (error) {
      console.error("Erreur lors du désarchivage :", error);
      toast.error("Erreur serveur : Impossible de désarchiver.");
    }
  };
  
   
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <h1 className="text-xl font-semibold mb-4">Courriers archivés</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <table className="w-full border border-gray-200 rounded-md shadow-sm table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Référence</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Expéditeur</th>
                <th className="px-4 py-2 text-left">Destinataire</th>
                <th className="px-4 py-2 text-left">Sujet</th>
                <th className="px-4 py-2 text-left">Etat</th>
                <th className="px-4 py-2 text-left">Date réception</th>
                <th className="px-4 py-2 text-left">Date Envoie</th>
                <th className="px-4 py-2 text-left">Désarchiver</th>
              </tr>
            </thead>
            <tbody>
              {archivedCourriers.map((courrier) => (
                <tr key={courrier.id} className="border-t">
                  <td className="px-4 py-2">{courrier.reference}</td>
                  <td className="px-4 py-2">{courrier.type}</td>
                  <td className="px-4 py-2">{courrier.expediteur}</td>
                  <td className="px-4 py-2">{courrier.destinataire}</td>
                  <td className="px-4 py-2">{courrier.sujet}</td>
                  <td className="px-4 py-2">{courrier.etat}</td>
                  <td className="px-4 py-2">
        {courrier.date_reception
          ? new Date(courrier.date_reception).toLocaleDateString("fr-FR")
          : "N/A"}
      </td>
      <td className="px-4 py-2">
        {courrier.date_envoi
          ? new Date(courrier.date_envoi).toLocaleDateString("fr-FR")
          : "N/A"}
      </td>
      <td className="px-4 py-2">
  <button
    onClick={() => handleUnarchive(courrier.id)}
    className="p-2 rounded-full bg-amber-700 text-white hover:bg-amber-800"
    title="Désarchiver"
  >
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
      <path d="M3 3h18v4H3V3z"></path>
      <path d="M5 7v14h14V7"></path>
      <path d="M10 11h4"></path>
    </svg>
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ArchivePage;
function setCourriers(arg0: (prevCourriers: { id: number; }[]) => ({ id: number; } | { archived: boolean; id: number; })[]) {
  throw new Error("Function not implemented.");
}

