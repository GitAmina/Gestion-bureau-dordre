/*'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.status === 200) {
      localStorage.setItem('token', data.token);
      router.push('/home');
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      <button onClick={() => router.push('/register')}>Créer un compte</button>
    </div>
  );
}*/
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Validation de l'email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validation du mot de passe
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
        "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule et un chiffre.",
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

  return (
    <div className="div1">
      <h1>Se connecter</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      <button onClick={() => router.push("/register")}>Créer un compte</button>
    </div>
  );
}
