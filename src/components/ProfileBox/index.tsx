'use client';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const ProfileBox = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUser({
          username: decoded.username || 'Utilisateur inconnu',
          prenom: decoded.prenom || 'Prénom non disponible',
          
          email: decoded.email || 'Email non disponible',
          role: decoded.role || 'Rôle non défini',
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

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return router.push('/login');
    }

    try {
      const response = await fetch('/api/auth/delete-user', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        console.error(result.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur de suppression', error);
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return router.push('/login');
    }

    try {
      const response = await fetch('/api/auth/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setUser({ ...user, ...formData });
        setIsEditing(false);
      } else {
        console.error(result.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur de mise à jour', error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="overflow-hidden rounded-[10px] bg-white shadow-lg dark:bg-gray-800">
      {/* Image de couverture */}
      <div className="relative h-35 md:h-65">
        <img
          src="/images/cover/top.jpg"
          alt="Photo de couverture"
          className="h-full w-full rounded-t-[10px] object-cover"
        />
      </div>

      {/* Section Profil */}
      <div className="p-5 text-center">
        <img
          src="/images/user/profile.png"
          alt="Avatar"
          className="mx-auto rounded-full border-4 border-white shadow-md"
          width={100}
          height={100}
        />
        <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          {loading ? "Chargement..." : user?.prenom + ' ' + user?.username || "Utilisateur"}
        </h2>

        {/* Affichage ou formulaire de modification */}
        {isEditing ? (
          <div>
            <input
              type="text"
              value={formData.prenom || user.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 mt-2 w-full"
              placeholder="Prénom"
            />
            <input
              type="text"
              value={formData.username || user.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 mt-2 w-full"
              placeholder="Nom"
            />
            <input
              type="email"
              value={formData.email || user.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1 mt-2 w-full"
              placeholder="Email"
            />
          </div>
        ) : (
          <div>
            <p className="text-gray-500 dark:text-gray-300">{user?.prenom}</p>
            <p className="text-gray-500 dark:text-gray-300">{user?.username}</p>
            <p className="text-gray-500 dark:text-gray-300">{user?.email}</p>
          </div>
        )}

        <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-300">
          {user.role}
        </span>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-center gap-4 pb-5">
        <button
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => setIsEditing(!isEditing)} // Basculer entre mode édition et affichage
        >
          {isEditing ? 'Annuler' : 'Modifier Profil'}
        </button>
        {isEditing && (
          <button
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            onClick={handleSaveChanges} // Sauvegarder les modifications
          >
            Sauvegarder
          </button>
        )}
        <button
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          onClick={() => setIsModalOpen(true)} // Ouvrir le modal de suppression
        >
          Supprimer
        </button>
      </div>

      {/* Modal de confirmation */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: 'auto',
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <div className="p-5">
          <h2>Êtes-vous sûr de vouloir supprimer votre compte ?</h2>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="rounded-lg bg-gray-600 px-4 py-2 text-white"
              onClick={() => setIsModalOpen(false)} // Fermer le modal
            >
              Annuler
            </button>
            <button
              className="rounded-lg bg-red-600 px-4 py-2 text-white"
              onClick={handleDeleteAccount} // Supprimer le compte
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileBox;
