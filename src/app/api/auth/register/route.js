

import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { username, prenom, email, password } = await req.json(); // Suppression du champ `role`

  if (!username || !prenom || !email || !password) {
    return new Response(JSON.stringify({ message: 'Tous les champs sont requis' }), { status: 400 });
  }

  // Vérifier si l'utilisateur existe déjà
  const [rows] = await db.execute('SELECT * FROM utilisateur WHERE email = ?', [email]);
  if (rows.length > 0) {
    return new Response(JSON.stringify({ message: 'Cet email est déjà utilisé' }), { status: 400 });
  }

  // Vérifier si un administrateur existe déjà
  const [adminCheck] = await db.execute('SELECT * FROM utilisateur WHERE role = "admin"');
  const isFirstAdmin = adminCheck.length === 0; // Si aucun admin, alors c'est le premier

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Définir le rôle
  const role = isFirstAdmin ? 'admin' : 'user'; // Premier inscrit = Admin, autres = Utilisateur

  // Insérer l'utilisateur avec le rôle défini
  await db.execute(
    'INSERT INTO utilisateur (username, prenom, email, password, role, date_creation) VALUES (?, ?, ?, ?, ?, NOW())',
    [username, prenom, email, hashedPassword, role]
  );

  return new Response(JSON.stringify({ message: 'Compte créé avec succès', role }), { status: 201 });
}
