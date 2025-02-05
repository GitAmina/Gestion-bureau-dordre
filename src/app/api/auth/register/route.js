/*import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { username, email, password, role } = await req.json();

  if (!username || !email || !password || !role) {
    return new Response(JSON.stringify({ message: 'Tous les champs sont requis' }), { status: 400 });
  }

  const [rows] = await db.execute('SELECT * FROM utilisateur WHERE email = ?', [email]);
  if (rows.length > 0) {
    return new Response(JSON.stringify({ message: 'Cet email est déjà utilisé' }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.execute('INSERT INTO utilisateur (username, email, password, role, date_creation) VALUES (?, ?, ?, ?, NOW())', 
    [username, email, hashedPassword, role]);

  return new Response(JSON.stringify({ message: 'Utilisateur créé avec succès' }), { status: 201 });
}
*/
import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { username, prenom, email, password, role } = await req.json(); // Ajout du prénom

  if (!username || !prenom || !email || !password || !role) { // Vérifier si le prénom est présent
    return new Response(JSON.stringify({ message: 'Tous les champs sont requis' }), { status: 400 });
  }

  const [rows] = await db.execute('SELECT * FROM utilisateur WHERE email = ?', [email]);
  if (rows.length > 0) {
    return new Response(JSON.stringify({ message: 'Cet email est déjà utilisé' }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Ajout du champ `prenom` dans l'insertion SQL
  await db.execute('INSERT INTO utilisateur (username, prenom, email, password, role, date_creation) VALUES (?, ?, ?, ?, ?, NOW())', 
    [username, prenom, email, hashedPassword, role]);

  return new Response(JSON.stringify({ message: 'Utilisateur créé avec succès' }), { status: 201 });
}
