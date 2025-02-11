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
    const { search, date, date_envoi, type, etat } = Object.fromEntries(
      new URL(req.url).searchParams
    );

    // Construire les conditions de filtrage dynamiquement
    let query = `
      SELECT 
        c.*, 
        d.id AS departement_id, 
        d.nom AS departement_nom,
        CASE 
          WHEN a.courrier_id IS NOT NULL THEN true 
          ELSE false 
        END AS archived
      FROM courrier c
      LEFT JOIN archive a ON c.id = a.courrier_id
      LEFT JOIN departement d ON c.departement_id = d.id
      WHERE 1=1
    `;

    const queryParams: any[] = [];

    // Appliquer les filtres si les paramètres existent
    if (search) {
      query += ` AND (c.reference LIKE ? OR c.expediteur LIKE ? OR c.destinataire LIKE ?)`;
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (date) {
      query += ` AND c.date_reception = ?`;
      queryParams.push(date);
    }

    if (date_envoi) {  // Ajout du filtre pour la date d'envoi
      query += ` AND c.date_envoi = ?`;
      queryParams.push(date_envoi);
    }

    if (type) {
      query += ` AND c.type = ?`;
      queryParams.push(type);
    }

    if (etat) {
      query += ` AND c.etat = ?`;
      queryParams.push(etat);
    }

    // Exécuter la requête avec les paramètres
      
    const [courriers] = await pool.execute(query, queryParams);

    // Mapper les courriers pour inclure les informations de département
    const courriersMapped = (courriers as Array<any>).map((courrier: any) => ({
      ...courrier,
      departement: courrier.departement_nom
        ? { id: courrier.departement_id, nom: courrier.departement_nom }
        : undefined,
    }));

    // 🔹 LOG : Vérifie la requête finale et les résultats
    console.log("Requête exécutée :", query);
    console.log("Paramètres :", queryParams);
    console.log("Résultats :", courriersMapped);

      return NextResponse.json(courriersMapped, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des courriers:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
  }