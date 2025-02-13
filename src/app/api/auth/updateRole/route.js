import db from '../../../lib/db';  // Ta connexion à la base de données
import { verifyToken } from '../../../lib/auth';  // Fonction de vérification du token

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Récupérer le token depuis l'en-tête Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    try {
      // Vérifier le token
      const decoded = verifyToken(token);

      // Vérifier si l'utilisateur est un admin
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Accès interdit, rôle non autorisé' });
      }

      // Récupérer l'ID et le nouveau rôle à partir du corps de la requête
      const { userId, newRole } = req.body;

      // Mettre à jour le rôle dans la base de données
      const [result] = await db.execute('UPDATE utilisateur SET role = ? WHERE id = ?', [newRole, userId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      return res.status(200).json({ message: 'Rôle mis à jour avec succès' });

    } catch (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
  } else {
    return res.status(405).json({ message: 'Méthode HTTP non autorisée' });
  }
}
