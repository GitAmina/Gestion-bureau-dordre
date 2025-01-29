/*'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await res.json();

    if (res.status === 201) {
      router.push('/login');
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h1>Créer un compte</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
*/

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './style.css';
export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const router = useRouter();

  // Validation de l'email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validation du mot de passe
  const isValidPassword = (password) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

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
      body: JSON.stringify({ username, email, password,role }),
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
    <div>
      <h1>Créer un compte</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
        <button type="submit">Créer un compte</button>
      </form>
      <button onClick={() => router.push('/login')}>Se connecter</button>
    </div>
  );
}
