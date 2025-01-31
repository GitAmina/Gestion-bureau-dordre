"use client";
import { useState, useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { toast } from "react-toastify";

const AjouterCourrier = () => {
  const [formData, setFormData] = useState({
    reference: "",
    type: "",
    etat: "",
    expediteur: "",
    destinataire: "",
    date_envoi: "",
    date_reception: "",
    sujet: "",
    departement: "",
    contenu: "",
    fichier_numerise: "", // Nouveau champ pour le nom du fichier numérisé
  });

  const [departements, setDepartements] = useState<any[]>([]); // Pour stocker les départements
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/courriers/ajouter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Envoie toutes les données du formulaire
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Ajout de courrier réussi");
        toast.success("Le courrier a été ajouté avec succès");
        setFormData({
          reference: "",
          type: "",
          etat: "",
          expediteur: "",
          destinataire: "",
          date_envoi: "",
          date_reception: "",
          sujet: "",
          departement: "",
          contenu: "",
          fichier_numerise: "", // Réinitialise le champ nom_fichier
        });
      } else {
        console.log("Erreur");
        toast.error("Erreur lors de l'ajout du courrier.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur");
    }
  };

  useEffect(() => {
    // Récupérer les départements
    const fetchDepartements = async () => {
      try {
        const res = await fetch("/api/departement");
        const data = await res.json();
        setDepartements(data);
      } catch (error) {
        console.error("Erreur lors du chargement des départements:", error);
      }
    };

    fetchDepartements();
  }, []); // Se déclenche une seule fois au montage

  useEffect(() => {
    // Initialisation de flatpickr pour les dates
    flatpickr("#date_envoi", {
      dateFormat: "Y-m-d",
      disableMobile: true,
      nextArrow: "→",
      prevArrow: "←",
      locale: {
        firstDayOfWeek: 1,
      },
      onChange: (selectedDates: Date[]) => {
        if (selectedDates[0]) {
          const correctedDate = new Date(
            selectedDates[0].getTime() -
              selectedDates[0].getTimezoneOffset() * 60000,
          );
          setFormData((prevData) => ({
            ...prevData,
            date_envoi: correctedDate.toISOString().split("T")[0],
          }));
        }
      },
    });

    flatpickr("#date_reception", {
      dateFormat: "Y-m-d",
      disableMobile: true,
      nextArrow: "→",
      prevArrow: "←",
      locale: {
        firstDayOfWeek: 1,
      },
      onChange: (selectedDates: Date[]) => {
        if (selectedDates[0]) {
          const correctedDate = new Date(
            selectedDates[0].getTime() -
              selectedDates[0].getTimezoneOffset() * 60000,
          );
          setFormData((prevData) => ({
            ...prevData,
            date_reception: correctedDate.toISOString().split("T")[0],
          }));
        }
      },
    });
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Ajout d'un courrier" />
      <div className="gap-9 sm:grid-cols-2">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
            <h3 className="font-semibold text-dark dark:text-white">
              Formulaire d&apos;ajout de courrier
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4.5 p-6.5">
              {/* Référence */}
              <InputGroup
                label="Référence"
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Entrez la référence"
                required
                customClasses="w-full"
              />

              {/* Type & État */}
              <div className="flex gap-4.5">
                <div className="w-1/2">
                  <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Sélectionnez le type</option>
                    <option value="Entrant">Entrant</option>
                    <option value="Sortant">Sortant</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                    État
                  </label>
                  <select
                    name="etat"
                    value={formData.etat}
                    onChange={handleChange}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Sélectionnez état</option>
                    <option value="En attente">En attente</option>
                    <option value="Traité">Traité</option>
                    <option value="Clôturé">Clôturé</option>
                  </select>
                </div>
              </div>

              {/* Expéditeur & Destinataire */}
              <div className="flex gap-4.5">
                <InputGroup
                  label="Expéditeur"
                  type="text"
                  name="expediteur"
                  value={formData.expediteur}
                  onChange={handleChange}
                  placeholder="Entrez l'expéditeur"
                  required
                  customClasses="w-1/2"
                />
                <InputGroup
                  label="Destinataire"
                  type="text"
                  name="destinataire"
                  value={formData.destinataire}
                  onChange={handleChange}
                  placeholder="Entrez le destinataire"
                  required
                  customClasses="w-1/2"
                />
              </div>

              {/* Dates */}
              <div className="flex gap-4.5">
                <div className="w-1/2">
                  <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                    Date envoi
                  </label>
                  <input
                    type="text" // Utilisation de flatpickr
                    id="date_envoi"
                    name="date_envoi"
                    value={formData.date_envoi}
                    onChange={handleChange}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="w-1/2">
                  <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                    Date de réception
                  </label>
                  <input
                    type="text" // Utilisation de flatpickr
                    id="date_reception"
                    name="date_reception"
                    value={formData.date_reception}
                    onChange={handleChange}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              {/* Sujet & Département */}
              <div className="flex gap-4.5">
                <InputGroup
                  label="Sujet"
                  type="text"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  placeholder="Entrez le sujet"
                  required
                  customClasses="w-1/2"
                />
                <div className="w-1/2">
                  <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                    Département
                  </label>
                  <select
                    name="departement"
                    value={formData.departement}
                    onChange={handleChange}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Sélectionnez un département</option>
                    {departements.map((departement) => (
                      <option key={departement.id} value={departement.id}>
                        {departement.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contenu */}
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Contenu
                </label>
                <textarea
                  name="contenu"
                  value={formData.contenu}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tapez le contenu"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Nom du fichier */}
              <div>
                <InputGroup
                  label="Nom du fichier numerisé"
                  type="text"
                  name="fichier_numerise"
                  value={formData.fichier_numerise}
                  onChange={handleChange}
                  placeholder="Entrez le nom du fichier"
                  customClasses="w-full"
                />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full rounded-[7px] bg-primary px-5 py-3 text-center text-base font-semibold text-white shadow-md transition-all hover:bg-opacity-90 focus:outline-none active:bg-opacity-90"
                >
                  Ajouter le courrier
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AjouterCourrier;
