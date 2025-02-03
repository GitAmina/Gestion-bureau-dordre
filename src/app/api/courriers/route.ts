import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Connexion à la base de données
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "bureau_ordre",
});

export async function GET(req: NextRequest) {
  try {
    // Effectuer une jointure entre les courriers et les départements pour récupérer le nom du département
    const [courriers] = await pool.execute(`
      SELECT 
        c.id, c.reference, c.type, c.expediteur, c.destinataire, c.sujet, 
        c.etat, c.date_reception, c.date_envoi, c.contenu, 
        d.id AS departement_id, d.nom AS departement_nom
      FROM Courrier c
      LEFT JOIN Departement d ON c.departement_id = d.id
    `);

    // courriers est maintenant typé comme un tableau d'objets, vous pouvez l'utiliser avec map
    const courriersMapped = (courriers as Array<any>).map((courrier: any) => ({
      ...courrier,
      departement: courrier.departement_nom
        ? { id: courrier.departement_id, nom: courrier.departement_nom }
        : undefined,
    }));

    return NextResponse.json(courriersMapped, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
