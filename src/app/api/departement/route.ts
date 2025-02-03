// src/app/api/departements/route.ts
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
    const [departements] = await pool.execute(`
      SELECT 
        Departement.id, 
        Departement.nom, 
        Departement.description, 
        Utilisateur.username AS responsable_username, 
        Utilisateur.role AS responsable_role
      FROM Departement
      LEFT JOIN Utilisateur ON Departement.responsable_id = Utilisateur.id
    `);

    return NextResponse.json(departements, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des départements:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
