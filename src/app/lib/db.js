import mysql from 'mysql2/promise';

// Configuration de la connexion MySQL
const db = mysql.createPool({
  host: 'localhost',     // Nom de l'hôte de la base de données
  user: 'root',          // Utilisateur MySQL
  password: '',          // Mot de passe MySQL
  database: 'bureau_ordre'  // Nom de la base de données
});

export default db;
