'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import Modal from 'react-modal';

// Assurer l'accessibilité de la modal


const ProfileBox = () => {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userData = {
          username: decoded.username || "Utilisateur inconnu",
          prenom: decoded.prenom || "Utilisateur inconnu",
          email: decoded.email || "Email non disponible",
          role: decoded.role || "Rôle non défini",
        };
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error("Token invalide", error);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
  }, [router]);

  const updateUser = async () => {
    try {
      const response = await fetch("/api/auth/update-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        console.log("Profil mis à jour !");
        setUser(editedUser);
      } else {
        console.error("Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch("/api/auth/delete-user", { method: "DELETE" });

      if (response.ok) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        console.error("Erreur lors de la suppression du compte");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  if (loading) return <div className="text-center py-10">Chargement...</div>;

  return (
    <div className="overflow-hidden rounded-[10px] bg-white shadow-lg dark:bg-gray-800">
      {/* Image de couverture */}
      <div className="relative h-35 md:h-65">
        <Image
          src="/images/cover/top.jpg"
          alt="Photo de couverture"
          className="h-full w-full rounded-t-[10px] object-cover"
          width={970}
          height={260}
        />
      </div>

      {/* Section Profil */}
      <div className="p-5 text-center">
        <Image
          src="/images/user/profile.png"
          alt="Avatar"
          className="mx-auto rounded-full border-4 border-white shadow-md"
          width={100}
          height={100}
        />

        {/* Nom et Prénom */}
        <div className="mt-4">
          <label className="block text-gray-700">Nom</label>
          {isEditing ? (
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={editedUser.username}
              onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
            />
          ) : (
            <p className="text-gray-900">{user.username}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Prénom</label>
          {isEditing ? (
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={editedUser.prenom}
              onChange={(e) => setEditedUser({ ...editedUser, prenom: e.target.value })}
            />
          ) : (
            <p className="text-gray-900">{user.prenom}</p>
          )}
        </div>

        {/* Email */}
        <div className="mt-4">
          <label className="block text-gray-700">Email</label>
          {isEditing ? (
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg"
              value={editedUser.email}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            />
          ) : (
            <p className="text-gray-900">{user.email}</p>
          )}
        </div>

        {/* Rôle */}
        <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-300">
          {user.role}
        </span>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-center gap-4 pb-5">
        <button
          className={`mt-4 rounded-lg px-4 py-2 text-white ${isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
          onClick={() => {
            if (isEditing) updateUser();
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? "Sauvegarder" : "Modifier Profil"}
        </button>

        {isEditing && (
          <button
            className="mt-4 ml-2 rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            onClick={() => {
              setIsEditing(false);
              setEditedUser(user);
            }}
          >
            Annuler
          </button>
        )}

        <button
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          onClick={() => setModalIsOpen(true)}
        >
          Supprimer
        </button>
      </div>

      {/* Modal de confirmation */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Confirmer la suppression</h2>
          <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setModalIsOpen(false)}
            >
              Annuler
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={confirmDelete}
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileBox;
