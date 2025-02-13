'use client';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Utilisateurs = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role !== "admin") {
        alert("Accès refusé !");
        window.location.href = "/";
        return;
      }

      axios
        .get("/api/auth/users", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setUsers(res.data);
          setLoading(false);
        })
        .catch((err) => console.error("Erreur lors du chargement :", err));
    } catch (error) {
      console.error("Token invalide", error);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  const handleRoleChange = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
  };

  const saveRoleChange = () => {
    if (!selectedUser) return;

    const token = localStorage.getItem("token");
    axios
      .put("/api/auth/users", { id: selectedUser.id, role: newRole }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, role: newRole } : user))
        );
        setSelectedUser(null);
      })
      .catch((err) => console.error("Erreur lors de la mise à jour du rôle :", err));
  };

  const handleDeleteUser = (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      return;
    }

    const token = localStorage.getItem("token");
    axios
      .delete("/api/auth/users", { data: { id }, headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((err) => console.error("Erreur lors de la suppression :", err));
  };

  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Utilisateurs" />

        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Liste des utilisateurs</h1>

          {loading ? (
            <p>Chargement...</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Nom</th>
                  <th className="border border-gray-300 p-2">Prenom</th>
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Rôle</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="text-center">
                    <td className="border border-gray-300 p-2">{user.username}</td>
                    <td className="border border-gray-300 p-2">{user.prenom}</td>
                    <td className="border border-gray-300 p-2">{user.email}</td>
                    <td className="border border-gray-300 p-2">{user.role}</td>
                    <td className="border border-gray-300 p-2 space-x-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleRoleChange(user)}>
                        Modifier
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteUser(user.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedUser && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Modifier le rôle</h2>
                <p className="mb-2">Utilisateur : {selectedUser.name}</p>
                <select className="p-2 border rounded w-full" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setSelectedUser(null)}>
                    Annuler
                  </button>
                  <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={saveRoleChange}>
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Utilisateurs;
