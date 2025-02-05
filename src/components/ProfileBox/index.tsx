'use client';

import React, { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation";  
import Image from "next/image"; 
import { jwtDecode } from 'jwt-decode'; 
import Modal from 'react-modal';

const ProfileBox = () => { 
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter(); 

  useEffect(() => { 
    if (typeof document !== "undefined") {
      const nextRoot = document.getElementById('__next');
      if (nextRoot) {
        Modal.setAppElement(nextRoot);
      }
    }

    if (typeof window !== "undefined") { 
      const token = localStorage.getItem('token'); 

      if (!token) { 
        router.push('/login'); 
        return;
      } 

      try { 
        const decoded = jwtDecode(token); 
        setUser({
          id: decoded.id,
          username: decoded.username || "Utilisateur inconnu",
          prenom: decoded.prenom || "Utilisateur inconnu",
          email: decoded.email || "Email non disponible",
          role: decoded.role || "Rôle non défini"
        });
      } catch (error) { 
        console.error('Token invalide', error); 
        localStorage.removeItem('token');
        router.push('/login'); 
      } finally {
        setLoading(false);
      }
    }
  }, [router]);

  const handleDeleteUser = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/auth/delete-user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        console.error("Erreur lors de la suppression de l'utilisateur");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

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
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          {user?.prenom + ' ' + user?.username || "Utilisateur"} 
        </h2>
        <p className="text-gray-500 dark:text-gray-300">{user?.email}</p>
        <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-300">
          {user?.role}
        </span>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-center gap-4 pb-5">
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Modifier Profil
        </button>
        <button
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          onClick={() => setIsModalOpen(true)}
        >
          Supprimer
        </button>
      </div>

      {/* Modal de confirmation */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-xl w-96 mx-auto mt-32"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h2>
        <p className="text-gray-600 mt-2">Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={() => setIsModalOpen(false)}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              handleDeleteUser();
              setIsModalOpen(false);
            }}
          >
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileBox;
