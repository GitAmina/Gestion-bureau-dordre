"use client";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";

// Définir le type pour un courrier
interface Courrier {
  id: number;
  reference: string;
  type: string;
  expediteur: string;
  destinataire: string;
  sujet: string;
  etat: "En attente" | "Traité" | "Clôturé";
  date_reception?: string; // Peut être null ou undefined
  date_envoi?: string; // Peut être null ou undefined
  contenu: string;
}

const RechercheFiltragePage = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Recherche
  const [filter, setFilter] = useState<{
    date_envoi: string; date: string; type: string; etat: string 
}>({
    date: "",
    date_envoi: "",
    type: "",
    etat: "",
  }); // Filtrage
  const [filteredCourriers, setFilteredCourriers] = useState<Courrier[]>([]); // Résultats des courriers
  const [selectedCourrier, setSelectedCourrier] = useState<Courrier | null>(null); // Courrier sélectionné pour les détails
  const [loading, setLoading] = useState<boolean>(false); // État de chargement
  const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle pour la pagination
  const itemsPerPage = 5; // Nombre d'éléments par page

  // Fonction pour rechercher les courriers
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Veuillez entrer une référence, un expéditeur ou un destinataire pour rechercher.");
      return;
    }

    setLoading(true); // Démarrage du chargement
    try {
      const response: AxiosResponse<Courrier[]> = await axios.get("/api/courriers", {
        params: {
          search: searchQuery.trim(),
        },
      });

      setFilteredCourriers(response.data); // Met à jour les résultats
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      alert("Une erreur est survenue lors de la recherche.");
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Fonction pour filtrer automatiquement les courriers
  const handleAutoFilter = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<Courrier[]> = await axios.get("/api/courriers", {
        params: {
          date: filter.date || undefined,
          date_envoi: filter.date_envoi || undefined,
          type: filter.type || undefined,
          etat: filter.etat || undefined,
        },
      });
      setFilteredCourriers(response.data); // Met à jour les résultats
    } catch (error) {
      console.error("Erreur lors du filtrage :", error);
      alert("Une erreur est survenue lors du filtrage.");
    } finally {
      setLoading(false);
    }
  };

  // Appeler automatiquement la fonction de filtrage dès qu'un filtre est modifié
  useEffect(() => {
    if (filter.date || filter.date_envoi || filter.type || filter.etat) {
      handleAutoFilter();
    }
  }, [filter]);

  // Fonction pour afficher les détails d'un courrier
  const handleViewDetails = (courrier: Courrier) => {
    setSelectedCourrier(courrier);
    toast.success("Les informations du courrier ont été affichées !");
  };

  // Fonction pour fermer les détails
  const handleCloseDetails = () => {
    setSelectedCourrier(null);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourriers = filteredCourriers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <Breadcrumb pageName="Recherche et Filtrage" />
        <div className="bg-white p-6 rounded-lg shadow">
          {/* Barre de recherche */}
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md w-full"
              placeholder="Rechercher par référence, expéditeur ou destinataire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Rechercher
            </button>
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label>Date de Réception:</label>
              <input
                type="date"
                className="border border-gray-300 p-2 rounded-md w-full"
                value={filter.date}
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              />
            </div>
            <div>
  <label>Date d'Envoi :</label>
  <input
    type="date"
    className="border border-gray-300 p-2 rounded-md w-full"
    value={filter.date_envoi}
    onChange={(e) => setFilter({ ...filter, date_envoi: e.target.value })}
  />
</div>

            <div>
              <label>Type de courrier:</label>
              <select
                className="border border-gray-300 p-2 rounded-md w-full"
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              >
                <option value="">Sélectionner</option>
                <option value="Entrant">Entrant</option>
                <option value="Sortant">Sortant</option>
              </select>
            </div>
            <div>
              <label>État:</label>
              <select
                className="border border-gray-300 p-2 rounded-md w-full"
                value={filter.etat}
                onChange={(e) => setFilter({ ...filter, etat: e.target.value })}
              >
                <option value="">Tous les États</option>
                <option value="En attente">En attente</option>
                <option value="Traité">Traité</option>
                <option value="Clôturé">Clôturé</option>
              </select>
            </div>
          </div>

          {/* Résultats */}
          <div className="mt-6">
            {loading ? (
              <p>Chargement des courriers...</p>
            ) : currentCourriers.length === 0 ? (
              <p>Aucun courrier trouvé.</p>
            ) : (
              <table className="w-full border border-gray-200 rounded-md shadow-sm table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Référence</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Expéditeur</th>
                    <th className="px-4 py-2 text-left">Destinataire</th>
                    <th className="px-4 py-2 text-left">Sujet</th>
                    <th className="px-4 py-2 text-left">État</th>
                    <th className="px-4 py-2 text-left">Date Réception</th>
                    <th className="px-4 py-2 text-left">Date Envoi</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCourriers.map((courrier) => (
                    <tr key={courrier.id} className="border-t">
                      <td className="px-4 py-2">{courrier.reference}</td>
                      <td className="px-4 py-2">{courrier.type}</td>
                      <td className="px-4 py-2">{courrier.expediteur}</td>
                      <td className="px-4 py-2">{courrier.destinataire}</td>
                      <td className="px-4 py-2">{courrier.sujet}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-sm ${
                            courrier.etat === "En attente"
                              ? "bg-red-100 text-red-600"
                              : courrier.etat === "Traité"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {courrier.etat}
                        </span>
                      </td>
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
                      </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Affichage des détails du courrier sélectionné */}
          {selectedCourrier && (
            <div className="mt-5 rounded-lg border border-stroke bg-white p-5 shadow">
              <h2 className="mb-4 text-xl font-semibold text-dark">Détails du courrier</h2>
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
                  <span className="font-semibold text-blue-600">{selectedCourrier.sujet || "N/A"}</span>
                </p>
                <p>
                  <strong>État :</strong>{" "}
                  <span
                    className={`inline-block rounded-full px-3 py-1 ${
                      selectedCourrier.etat === "Clôturé"
                        ? "bg-green-100 text-green-600"
                        : selectedCourrier.etat === "En attente"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {selectedCourrier.etat}
                  </span>
                </p>
                <p>
                  <strong>Date Réception :</strong>{" "}
                  {selectedCourrier.date_reception
                    ? new Date(selectedCourrier.date_reception).toLocaleDateString("fr-FR")
                    : "N/A"}
                </p>
                <p>
                  <strong>Date Envoi :</strong>{" "}
                  {selectedCourrier.date_envoi
                    ? new Date(selectedCourrier.date_envoi).toLocaleDateString("fr-FR")
                    : "N/A"}
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
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RechercheFiltragePage;



