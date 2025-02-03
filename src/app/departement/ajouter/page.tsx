"use client";
import { useState, useEffect } from "react";
import "flatpickr/dist/flatpickr.min.css";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { toast } from "react-toastify";

const AjouterCourrier = () => {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    responsable: "",
  });

  const [utilisateurs, setUtilisateurs] = useState<any[]>([]); // Pour stocker les départements
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
      const res = await fetch("/api/departement/ajouter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Envoie toutes les données du formulaire
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Ajout du departement réussi");
        toast.success("Le departement a été ajouté avec succès");
        setFormData({
          nom: "",
          description: "",
          responsable: "",
        });
      } else {
        console.log("Erreur");
        toast.error("Erreur lors de l'ajout du departement.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur");
    }
  };

  useEffect(() => {
    // Récupérer les départements
    const fetchUtilisateurs = async () => {
      try {
        const res = await fetch("/api/utilisateur");
        const data = await res.json();
        setUtilisateurs(data);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      }
    };

    fetchUtilisateurs();
  }, []); // Se déclenche une seule fois au montage

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Ajout de departement" />
      <div className="gap-9 sm:grid-cols-2">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4.5 p-6.5">
              {/* Nom */}
              <InputGroup
                label="Nom"
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Entrez le nom"
                required
                customClasses="w-full"
              />

              {/* Description */}
              <div>
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Contenu
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={7}
                  placeholder="Tapez le contenu"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Utilisateur */}
              <div className="flex gap-4.5">
                <div className="w-full">
                  <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
                    Utilisateur
                  </label>
                  <select
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
                    required
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Sélectionnez un département</option>
                    {utilisateurs.map((utilisateur) => (
                      <option key={utilisateur.id} value={utilisateur.id}>
                        {utilisateur.username} - {utilisateur.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full rounded-[7px] bg-primary px-5 py-3 text-center text-base font-semibold text-white shadow-md transition-all hover:bg-opacity-90 focus:outline-none active:bg-opacity-90"
                >
                  Ajouter le departement
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
