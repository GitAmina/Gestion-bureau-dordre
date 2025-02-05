import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import db from '../../../lib/db'; // Import de la connexion à la base de données

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Récupère le token JWT depuis les en-têtes
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token manquant ou invalide' });
    }

    try {
      // Vérifie et décode le JWT
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;

      // Exécution de la requête SQL pour récupérer l'utilisateur
      db.query(
        'SELECT username, email FROM utilisateur WHERE id = ?',
        [userId],
        (err, results) => {
          if (err) {
            console.error('Erreur lors de la récupération des données utilisateur', err);
            return res.status(500).json({ error: 'Erreur serveur' });
          }

          if (results.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
          }

          // Renvoie les informations utilisateur
          const utilisateur = results[0];
          return res.status(200).json({
            nom: utilisateur.username,
            email: utilisateur.email,
          });
        }
      );
    } catch (error) {
      return res.status(401).json({ error: 'Token invalide ou expiré' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
