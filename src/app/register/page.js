'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './style.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Validation de l'email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validation du mot de passe
  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Le nom d'utilisateur est obligatoire.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    if (!isValidPassword(password)) {
      alert("Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule et un chiffre.");
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, prenom, email, password }),
    });

    const data = await res.json();

    if (res.status === 201) {
      alert(`Compte créé avec succès. Votre rôle est : ${data.role}`);
      router.push('/login');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-page">
      <div className="left-section">
        <div className="image-container">
          <img src="/images/user/7.png" alt="Gestion Bureau d'Ordre" className="login-image" />
        </div>
      </div>

      <div className="right-section">
        <div className="login-container">
          <div className="university-logo">
            <img src="/images/user/image.png" alt="Logo de l'université" className="logo" />
          </div>

          <form onSubmit={handleRegister} className="login-form">
            <div className="input-group">
              <label htmlFor="prenom" className="input-label">Prénom</label>
              <div className="input-container">
                <input type="text" placeholder="Entrez votre prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required className="input-field" />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="username" className="input-label">Nom d'utilisateur</label>
              <div className="input-container">
                <input type="text" placeholder="Entrez votre nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required className="input-field" />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email" className="input-label">Email</label>
              <div className="input-container">
                <input type="email" placeholder="Entrez votre email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" />
                <span className="input-icon">✉️</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Mot de passe</label>
              <div className="input-container">
                <input type="password" placeholder="Entrez votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" />
                <span className="input-icon">🔒</span>
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
