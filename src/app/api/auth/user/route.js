
import jwt from 'jsonwebtoken';

export async function GET(request) {
  const token = request.cookies.get('token'); // Récupérer le token dans les cookies
  if (!token) {
    return new Response(JSON.stringify({ error: 'Token manquant' }), { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Décoder le token
    console.log('Token décodé:', decoded); // Pour vérifier le contenu du token

    // Récupérer les informations de l'utilisateur depuis le token
    const user = {
      prenom: decoded.prenom, // Récupérer le prénom depuis le token
      username: decoded.username,
      email: decoded.email,
      role: decoded.role
    };

    // Vérifie si les informations de l'utilisateur sont présentes
    if (!user.prenom || !user.username || !user.email|| !user.role) {
      return new Response(JSON.stringify({ error: 'Informations utilisateur manquantes dans le token' }), { status: 400 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Erreur de décryptage du token:', error); // Log en cas d'erreur
    return new Response(JSON.stringify({ error: 'Token invalide ou expiré' }), { status: 401 });
  }
}

