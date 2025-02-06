"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // État pour gérer la visibilité du mot de passe
  const router = useRouter();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    if (!isValidPassword(password)) {
      alert(
        "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule et un chiffre."
      );
      return;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.status === 200) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      alert(data.message);
    }
  };

  // Fonction pour basculer la visibilité du mot de passe
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

      {/* Section de droite (formulaire de connexion) */}
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

         
          <form onSubmit={handleLogin} className="login-form">
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
                  type={showPassword ? "text" : "password"} // Basculer entre "text" et "password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                />
                <span
                  className="input-icon password-toggle"
                  onClick={togglePasswordVisibility} // Ajouter un gestionnaire de clic
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"} {/* Icône pour afficher/masquer */}
                </span>
              </div>
            </div>

            <button type="submit" className="login-btn">Se connecter</button>
          </form>
          <p className="forgot-password">
            <a href="/forgot-password">Mot de passe oublié ?</a>
          </p>
          <p className="register-link">
            Pas de compte ? <a href="/register">S'inscrire</a>
          </p>
        </div>
      </div>
    </div>
  );
}
// <h1 className="login-title">Connexion</h1>