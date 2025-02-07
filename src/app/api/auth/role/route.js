import { verifyToken } from '../../../lib/auth';  // Fonction de vérification du token JWT

const secret = 'ta_clé_secrète_pour_jwt'; // Utilise ta propre clé secrète

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Récupérer le token depuis l'en-tête Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    try {
      // Vérifier le token
      const decoded = verifyToken(token);  // Fonction qui décode et vérifie le token

      // Vérification du rôle
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Accès interdit, rôle non autorisé' });
      }

      // Si l'utilisateur est un admin
      return res.status(200).json({ message: 'Accès autorisé. Vous êtes un admin.' });
    } catch (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
  } else {
    return res.status(405).json({ message: 'Méthode HTTP non autorisée' });
  }
}
