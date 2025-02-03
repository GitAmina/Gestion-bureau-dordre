import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Connexion à la base de données
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "bureau_ordre",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Données reçues:", body); // Log des données reçues

    const {
      reference,
      type,
      etat,
      expediteur,
      destinataire,
      date_envoi,
      date_reception,
      sujet,
      departement,
      contenu,
      fichier_numerise, // Récupération du nom du fichier numérisé
    } = body;

    // Requête SQL d'insertion
    const [result] = await pool.execute(
      `INSERT INTO courrier (reference, type, etat, expediteur, destinataire, date_envoi, date_reception, sujet, departement_id, contenu, fichier_numerise)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reference,
        type,
        etat || "En attente", // Si aucun état n'est fourni, l'état est "En attente" par défaut
        expediteur,
        destinataire,
        date_envoi || null,
        date_reception || null,
        sujet,
        departement || null,
        contenu,
        fichier_numerise || null, // Enregistrer le nom du fichier numérisé (si disponible)
      ],
    );

    console.log("Résultat de la requête:", result); // Log du résultat de la requête

    const insertId = (result as mysql.ResultSetHeader).insertId;

    return NextResponse.json(
      { message: "Courrier ajouté avec succès", id: insertId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout du courrier:", error); // Log d'erreur côté serveur
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
