'use client'; // Cette ligne doit être en haut du fichier pour que le code fonctionne côté client

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Utilise 'next/navigation' dans l'app directory

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    // Ce code s'exécute après que le composant ait été monté côté client
    localStorage.removeItem('token'); // Supprimer le token JWT du stockage local
    router.push('/login'); // Rediriger vers la page de connexion
  }, [router]); // Assure-toi que le router est bien passé en dépendance

  return <p>Déconnexion en cours...</p>;
}
