//src/app/courriers/page.tsx
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import Swal from "sweetalert2";

// Définition du type de courrier avec des informations supplémentaires
interface Departement {
  id: number;
  nom: string;
}

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
  contenu?: string; // Contenu du courrier
  departement?: Departement; // Département en tant qu'objet
  fichier_numerise?: string; // Nom du fichier numérisé
}

export default function Courriers() {
  const [courriers, setCourriers] = useState<Courrier[]>([]);
  const [selectedCourrier, setSelectedCourrier] = useState<Courrier | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Nombre d'éléments par page
  const [sortBy, setSortBy] = useState<"Entrant" | "Sortant" | "date" | null>(
    null,
  ); // Pour le trie
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    fetch("/api/courriers")
      .then((response) => response.json())
      .then((data: Courrier[]) => {
        console.log("Données reçues:", data);
        setCourriers(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des courriers:", error);
        toast.error(
          "Une erreur est survenue lors du chargement des courriers.",
        );
      });
  }, []);

  // Fonction pour gérer le clic sur l'icône d'information
  const handleViewDetails = (courrier: Courrier) => {
    setSelectedCourrier(courrier);
    toast.success("Les informations du courrier ont été affichées !");
  };

  // Fonction pour fermer la vue des détails
  const handleCloseDetails = () => {
    setSelectedCourrier(null);
  };

  // Fonction pour gérer la suppression d'un courrier
  const handleDelete = async (courrierId: number) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    });

    // Vérifier si l'utilisateur a confirmé la suppression
    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/courriers/${courrierId}`, {
        method: "DELETE",
      });

      const data = await response.json(); // Récupère le message retourné par l'API
      console.log("Réponse API :", data);

      if (response.ok) {
        setCourriers(courriers.filter((c) => c.id !== courrierId));
        Swal.fire("Supprimé !", "Le courrier a été supprimé.", "success");
      } else {
        Swal.fire(
          "Erreur",
          `Impossible de supprimer : ${data.message}`,
          "error",
        );
      }
    } catch (error) {
      console.error("Erreur de suppression :", error);
      Swal.fire("Erreur", "Une erreur s'est produite.", "error");
    }
  };

  // Variable de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Fonction de trie
  const sortedCourriers = [...courriers]
    .filter((c) => {
      if (sortBy === "Entrant") return c.type === "entrant";
      if (sortBy === "Sortant") return c.type === "sortant";
      return true; // Afficher tout si aucun filtre spécifique
    })
    .sort((a, b) => {
      if (sortBy === "Entrant") {
        return (
          (b.date_reception ? new Date(b.date_reception).getTime() : 0) -
          (a.date_reception ? new Date(a.date_reception).getTime() : 0)
        );
      }
      if (sortBy === "Sortant") {
        return (
          (b.date_envoi ? new Date(b.date_envoi).getTime() : 0) -
          (a.date_envoi ? new Date(a.date_envoi).getTime() : 0)
        );
      }
      if (sortBy === "date") {
        const dateA = a.date_reception || a.date_envoi;
        const dateB = b.date_reception || b.date_envoi;
        return (
          (dateB ? new Date(dateB).getTime() : 0) -
          (dateA ? new Date(dateA).getTime() : 0)
        );
      }
      return 0;
    });

  // Tableau paginer et trier
  const currentCourriers = sortedCourriers.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Pour mettre un courrier en favorie
  const handleFavoriteToggle = (courrierId: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(courrierId)
        ? prevFavorites.filter((id) => id !== courrierId)
        : [...prevFavorites, courrierId],
    );
  };

  // Pour telecharger un courrier
  const downloadCourrier = async (id: number) => {
    try {
      const response = await fetch(`/api/courriers/telecharger?id=${id}`);

      if (!response.ok) {
        console.error("Erreur lors du téléchargement :", await response.text());
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      // Récupérer le nom du fichier depuis l'en-tête de la réponse
      const fileName =
        response.headers.get("Content-Disposition")?.split("filename=")[1] ||
        "courrier.pdf";

      a.download = fileName.replace(/"/g, ""); // Nettoyer les guillemets
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Liste des courriers" />
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="max-w-full overflow-x-auto">
          {/* Bouton de trie */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setSortBy("Entrant")}
              className="rounded bg-blue-400 px-4 py-2 text-white"
            >
              Trier par Entrant
            </button>
            <button
              onClick={() => setSortBy("Sortant")}
              className="rounded bg-green-400 px-4 py-2 text-white"
            >
              Trier par Sortant
            </button>
            <button
              onClick={() => setSortBy("date")}
              className="rounded bg-gray-400 px-4 py-2 text-white"
            >
              Trier par Date
            </button>
            <button
              onClick={() => setSortBy(null)}
              className="rounded bg-red-400 px-4 py-2 text-white"
            >
              Réinitialiser
            </button>
          </div>
          <br />
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#F7F9FC] dark:bg-dark-2">
                <th className="bg-center px-4 py-4 font-medium text-dark dark:text-white">
                  Référence
                </th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">
                  Type
                </th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">
                  Expéditeur
                </th>
                <th className="font-medium text-dark dark:text-white">
                  Destinataire
                </th>
                <th className="font-medium text-dark dark:text-white">Sujet</th>
                <th className="font-medium text-dark dark:text-white">Etat</th>
                <th className="font-medium text-dark dark:text-white">
                  Date réception
                </th>
                <th className="font-medium text-dark dark:text-white">
                  Date envoi
                </th>
                <th className="font-medium text-dark dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCourriers.map((courrier) => (
                <tr key={courrier.id}>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {courrier.reference}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {courrier.type}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {courrier.expediteur}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {courrier.destinataire}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {courrier.sujet}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <span
                      className={`inline-flex rounded-full px-3.5 py-1 text-body-sm font-medium ${courrier.etat === "Clôturé" ? "bg-[#219653]/[0.08] text-[#219653]" : courrier.etat === "En attente" ? "bg-[#D34053]/[0.08] text-[#D34053]" : "bg-[#FFA70B]/[0.08] text-[#FFA70B]"}`}
                    >
                      {courrier.etat}
                    </span>
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {courrier.date_reception
                      ? new Date(courrier.date_reception).toLocaleDateString(
                          "fr-FR",
                        )
                      : "N/A"}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    {courrier.date_envoi
                      ? new Date(courrier.date_envoi).toLocaleDateString(
                          "fr-FR",
                        )
                      : "N/A"}
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5">
                    <div className="flex items-center justify-end space-x-3.5">
                      <button
                        className="hover:text-primary"
                        onClick={() => handleViewDetails(courrier)}
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
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <Link href={`/courriers/modifier/${courrier.id}`}>
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
                            <path d="M14 2l7 7-12 12-7-7L14 2z"></path>
                          </svg>
                        </button>
                      </Link>

                      <button
                        className="hover:text-primary"
                        onClick={() => handleDelete(courrier.id)}
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
                          <path d="M6 7L18 7"></path>
                          <path d="M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7M16 7H8V19C8 19.5523 8.44772 20 9 20H15C15.5523 20 16 19.5523 16 19V7Z"></path>
                        </svg>
                      </button>

                      <button
                        className="hover:text-green-500"
                        onClick={() => handleFavoriteToggle(courrier.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill={
                            favorites.includes(courrier.id) ? "green" : "none"
                          }
                          stroke={
                            favorites.includes(courrier.id)
                              ? "green"
                              : "currentColor"
                          }
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 17.27 18.18 21 15.54 13.97 21 9.24 13.81 8.63 12 2 10.19 8.63 3 9.24 8.46 13.97 5.82 21" />
                        </svg>
                      </button>

                      <button
                        className="hover:text-primary"
                        onClick={() => downloadCourrier(courrier.id)}
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
                          <path d="M4 14L12 22L20 14"></path>
                          <path d="M12 2V22"></path>
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

      {/* Bouton de pagination */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`rounded px-4 py-2 ${currentPage === 1 ? "bg-gray-300" : "bg-indigo-500 text-white hover:bg-indigo-500"}`}
        >
          Précédent
        </button>

        <span>
          Page {currentPage} /{" "}
          {Math.max(1, Math.ceil(sortedCourriers.length / itemsPerPage))}
        </span>

        <span className="ml-4">
          Affichés{" "}
          {Math.min(currentPage * itemsPerPage, sortedCourriers.length)} /{" "}
          {sortedCourriers.length}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(sortedCourriers.length / itemsPerPage),
              ),
            )
          }
          disabled={
            currentPage === Math.ceil(sortedCourriers.length / itemsPerPage)
          }
          className={`rounded px-4 py-2 ${currentPage === Math.ceil(sortedCourriers.length / itemsPerPage) ? "bg-gray-300" : "bg-indigo-500 text-white hover:bg-indigo-500"}`}
        >
          Suivant
        </button>
      </div>

      {/* Affichage des détails du courrier sélectionné */}
      {selectedCourrier && (
        <div className="mt-5 rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <h2 className="mb-4 text-xl font-semibold text-dark dark:text-white">
            Détails du courrier
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>Référence :</strong> {selectedCourrier.reference}
            </p>
            <p>
              <strong>Expéditeur :</strong> {selectedCourrier.expediteur}
            </p>
            <p>
              <strong>Destinataire :</strong> {selectedCourrier.destinataire}
            </p>
            <p>
              <strong>Sujet :</strong>{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {selectedCourrier.sujet || "N/A"}
              </span>
            </p>
            <p>
              <strong>État :</strong>{" "}
              <span
                className={`inline-flex rounded-full px-3.5 py-1 text-body-sm font-medium ${
                  selectedCourrier.etat === "Clôturé"
                    ? "bg-[#219653]/[0.08] text-[#219653]"
                    : selectedCourrier.etat === "En attente"
                      ? "bg-[#D34053]/[0.08] text-[#D34053]"
                      : "bg-[#FFA70B]/[0.08] text-[#FFA70B]"
                }`}
              >
                {selectedCourrier.etat}
              </span>
            </p>
            <p>
              <strong>Département :</strong>{" "}
              {selectedCourrier.departement?.nom || "N/A"}
            </p>
            <p>
              <strong>Date réception :</strong>{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {selectedCourrier.date_reception
                  ? new Date(
                      selectedCourrier.date_reception,
                    ).toLocaleDateString("fr-FR")
                  : "N/A"}
              </span>
            </p>
            <p>
              <strong>Date envoi :</strong>{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {selectedCourrier.date_envoi
                  ? new Date(selectedCourrier.date_envoi).toLocaleDateString(
                      "fr-FR",
                    )
                  : "N/A"}
              </span>
            </p>
            <p className="col-span-2">
              <strong>Contenu :</strong> {selectedCourrier.contenu || "N/A"}
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCloseDetails}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
