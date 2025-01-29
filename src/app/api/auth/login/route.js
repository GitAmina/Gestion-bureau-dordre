import db from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../lib/auth';

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: 'Email et mot de passe sont requis' }), { status: 400 });
  }

  const [rows] = await db.execute('SELECT * FROM utilisateur WHERE email = ?', [email]);
  const user = rows[0];

  if (!user) {
    return new Response(JSON.stringify({ message: 'Utilisateur non trouvé' }), { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({ message: 'Mot de passe incorrect' }), { status: 400 });
  }

  const token = generateToken(user);
  return new Response(JSON.stringify({ token }), { status: 200 });
}
