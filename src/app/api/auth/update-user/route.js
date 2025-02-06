import db from '../../../lib/db'; // Assurez-vous que votre db est bien importée
import { verifyToken } from '../../../lib/auth';

// Fonction pour gérer la mise à jour de l'utilisateur
export async function PUT(req) {
  try {
    // Vérification du token pour authentifier l'utilisateur
    const token = req.headers.get('Authorization')?.split(' ')[1];  // Récupère le token du header "Authorization"
    if (!token) {
      return new Response('Token manquant', { status: 403 });  // Si le token est manquant, retourne une erreur 403
    }

    // Décode le token et obtient les informations de l'utilisateur
    const decoded = verifyToken(token);  // Vérifie et décode le token
    if (!decoded) {
      return new Response('Token invalide ou expiré', { status: 403 });  // Si le token est invalide ou expiré, retourne une erreur 403
    }

    // Récupère les données envoyées dans la requête (par exemple, le nouveau nom d'utilisateur)
    const { username } = await req.json();
    if (!username) {
      return new Response('Nom d\'utilisateur manquant', { status: 400 });  // Si le nom d'utilisateur est manquant, retourne une erreur 400
    }

    // Mise à jour de l'utilisateur dans la base de données
    const result = await db.query(
      'UPDATE utilisateur SET username = ? WHERE id = ?', 
      [username, decoded.id]  // Met à jour le `username` de l'utilisateur avec l'id du token
    );

    // Vérifie si la mise à jour a réussi
    if (result.affectedRows > 0) {
      return new Response(JSON.stringify({ message: 'Utilisateur mis à jour' }), { status: 200 });
    } else {
      return new Response('Échec de la mise à jour', { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return new Response('Erreur serveur', { status: 500 });  // En cas d'erreur serveur, retourne une erreur 500
  }
}
