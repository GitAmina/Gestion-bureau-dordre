// src/app/courriers/modifier/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import "flatpickr/dist/flatpickr.min.css";
import flatpickr from "flatpickr";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModifierCourrier = () => {
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
    fichier_numerise: "",
  });

  const [departements, setDepartements] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [courrierId, setCourrierId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    // Si le champ est vidé, on le définit comme null
    const updatedValue = value.trim() === "" ? null : value;

    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courrierId) {
      toast.error("ID du courrier manquant !");
      return;
    }

    // Trouver l'ID du département correspondant au nom
    const selectedDepartement = departements.find(
      (dep) => dep.nom === formData.departement,
    );

    if (!selectedDepartement) {
      toast.error("Département invalide !");
      return;
    }

    const dataToSend = {
      ...formData,
      departement: selectedDepartement.id, // Envoyer l'ID du département
      date_envoi: formData.date_envoi || null, // Envoyer null si la date est vide
      date_reception: formData.date_reception || null, // Envoyer null si la date est vide
    };

    try {
      const response = await fetch(`/api/courriers/${courrierId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Courrier modifié avec succès !");
      } else {
        toast.error(result.message || "Une erreur est survenue !");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur !");
    }
  };

  useEffect(() => {
    setIsClient(true);
    const url = window.location.pathname;
    const id = url.split("/")[3];
    setCourrierId(id);

    if (id) {
      fetchData(id);
    }
  }, []);

  useEffect(() => {
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
  }, []);

  const fetchData = async (courrierId: string) => {
    try {
      // Récupérer les données du courrier
      const response = await fetch(`/api/courriers/${courrierId}`);
      const data = await response.json();

      // Récupérer le département associé au courrier
      const departementResponse = await fetch(
        `/api/courriers/${courrierId}/departement`,
      );
      const departementData = await departementResponse.json();

      // Formater les données
      const formattedData = {
        ...data,
        date_envoi: data.date_envoi ? data.date_envoi.split("T")[0] : null, // Définir comme null si vide
        date_reception: data.date_reception
          ? data.date_reception.split("T")[0]
          : null, // Définir comme null si vide
        departement: departementData.nom || "", // Utiliser le nom du département
      };

      setFormData(formattedData);
    } catch (error) {
      toast.error("Erreur de récupération du courrier !");
    }
  };

  useEffect(() => {
    if (isClient) {
      // Initialiser Flatpickr pour le champ date_envoi
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

      // Initialiser Flatpickr pour le champ date_reception
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
    }
  }, [isClient]); // Dépendance sur isClient

  if (!isClient) return null;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Modification d'un courrier" />
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <InputGroup
            label="Référence"
            type="text"
            name="reference"
            value={formData.reference || ""} // Affichage vide au lieu de "N/A"
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              label="Expéditeur"
              type="text"
              name="expediteur"
              value={formData.expediteur || ""} // Affichage vide au lieu de "N/A"
              onChange={handleChange}
              required
            />
            <InputGroup
              label="Destinataire"
              type="text"
              name="destinataire"
              value={formData.destinataire || ""} // Affichage vide au lieu de "N/A"
              onChange={handleChange}
              required
            />
          </div>

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
                <option value="entrant">entrant</option>
                <option value="sortant">sortant</option>
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
                required
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              >
                <option value="">Sélectionnez état</option>
                <option value="En attente">En attente</option>
                <option value="Traité">Traité</option>
                <option value="Clôturé">Clôturé</option>
              </select>
            </div>
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
                value={formData.date_envoi || ""}
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
                value={formData.date_reception || ""}
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
              value={formData.sujet || ""} // Affichage vide si pas de sujet
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
                value={formData.departement || ""}
                onChange={handleChange}
                required
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              >
                <option value="">Sélectionnez un département</option>
                {departements.map((departement) => (
                  <option key={departement.id} value={departement.nom}>
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
              value={formData.contenu || ""} // Affichage vide si pas de contenu
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
              value={formData.fichier_numerise || ""} // Affichage vide si pas de fichier
              onChange={handleChange}
              placeholder="Entrez le nom du fichier"
              customClasses="w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded bg-emerald-500 p-3 text-white hover:bg-emerald-500"
          >
            Modifier
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default ModifierCourrier;
