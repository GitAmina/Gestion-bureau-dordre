/*import jwt from 'jsonwebtoken';

// Générer un token JWT
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username,prenom:user.prenom, email: user.email, role: user.role },
    'secret_key',  // Remplace par une clé secrète sécurisée
    { expiresIn: '1h' }
  );
};

// Vérifier un token JWT
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, 'secret_key'); // Remplace par la même clé secrète utilisée pour générer le token
  } catch (err) {
    return null;
  }
};
*/
import jwt from 'jsonwebtoken';

// Définir la clé secrète directement dans le code (pas recommandé en production)
const JWT_SECRET_KEY = 'maCleSuperSecrete123!'; // Remplace par ta clé secrète

// Générer un token JWT
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, prenom: user.prenom, email: user.email, role: user.role },
    JWT_SECRET_KEY,  // Utilisation de la clé secrète définie directement
    { expiresIn: '1h' }
  );
};

// Vérifier un token JWT
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);  // Vérification avec la même clé secrète
  } catch (err) {
    return null;
  }
};
