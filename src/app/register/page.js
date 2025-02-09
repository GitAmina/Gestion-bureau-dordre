'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './style.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const router = useRouter();

  // Validation de l'email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validation du mot de passe
  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert('Le nom d\'utilisateur est obligatoire.');
      return;
    }

    if (!isValidEmail(email)) {
      alert('Veuillez entrer une adresse email valide.');
      return;
    }

    if (!isValidPassword(password)) {
      alert(
        'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule et un chiffre.'
      );
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, prenom, email, password, role }),
    });

    const data = await res.json();

    if (res.status === 201) {
      alert('Compte créé avec succès. Veuillez vous connecter.');
      router.push('/login');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-page">
      {/* Section de gauche avec l'image */}
      <div className="left-section">
        <div className="image-container">
          <img
            src="/images/user/login1.jpg" // Utilisation de votre image
            alt="Gestion Bureau d'Ordre"
            className="login-image"
          />
        </div>
      </div>

      {/* Section de droite (formulaire d'inscription) */}
      <div className="right-section">
        <div className="login-container">
          {/* Logo de l'université */}
          <div className="university-logo">
            <img
              src="/images/user/image.png" // Remplacez par le chemin de votre logo
              alt="Logo de l'université"
              className="logo"
            />
          </div>

          
          <form onSubmit={handleRegister} className="login-form">
            <div className="input-group">
              <label htmlFor="prenom" className="input-label">Prénom</label>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Entrez votre prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="username" className="input-label">Nom d'utilisateur</label>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email" className="input-label">Email</label>
              <div className="input-container">
                <input
                  type="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                />
                <span className="input-icon">✉️</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Mot de passe</label>
              <div className="input-container">
                <input
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                />
                <span className="input-icon">🔒</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="role" className="input-label">Rôle</label>
              <div className="input-container">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>

            <button type="submit" className="login-btn">Créer un compte</button>
          </form>
          <p className="register-link">
            Déjà un compte ? <a href="/login">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  );
}