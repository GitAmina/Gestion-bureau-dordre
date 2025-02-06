
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
