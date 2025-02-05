/*import db from '../../../lib/db'; // Connexion à la base de données
import { verifyToken } from '../../../lib/auth'; // Fonction pour vérifier le token

export async function DELETE(req) {
  // Récupérer le token de la requête
  const token = req.headers.get('Authorization')?.split(' ')[1]; // L'extraction du token Bearer

  if (!token) {
    return new Response(JSON.stringify({ message: 'Token manquant' }), { status: 401 });
  }

  // Vérifier le token
  const user = verifyToken(token); // Utiliser la fonction de vérification du token
  
  if (!user) {
    return new Response(JSON.stringify({ message: 'Token invalide ou expiré' }), { status: 401 });
  }

  // Supprimer l'utilisateur de la base de données
  const { id } = user;
  try {
    const [result] = await db.execute('DELETE FROM utilisateur WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: 'Utilisateur non trouvé' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Utilisateur supprimé avec succès' }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Erreur lors de la suppression de l\'utilisateur' }), { status: 500 });
  }
}

import db from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export async function DELETE(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Récupérer le token JWT du header
  
  if (!token) {
    return new Response(JSON.stringify({ message: 'Token manquant' }), { status: 401 });
  }

  const decoded = verifyToken(token); // Vérifier le token
  if (!decoded) {
    return new Response(JSON.stringify({ message: 'Token invalide' }), { status: 403 });
  }

  // Supprimer l'utilisateur basé sur l'ID extrait du token
  try {
    const [result] = await db.execute('DELETE FROM utilisateur WHERE id = ?', [decoded.id]);
    
    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: 'Utilisateur non trouvé' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Utilisateur supprimé avec succès' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Erreur lors de la suppression', error: err.message }), { status: 500 });
  }
}
*/

import db from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
export async function DELETE(req) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return new Response(JSON.stringify({ message: "Accès refusé, token manquant" }), { status: 403 });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return new Response(JSON.stringify({ message: "Token invalide" }), { status: 403 });
  }

  try {
    await db.execute('DELETE FROM utilisateur WHERE id = ?', [decoded.id]);

    return new Response(JSON.stringify({ message: "Utilisateur supprimé avec succès" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Erreur serveur", error }), { status: 500 });
  }
}
