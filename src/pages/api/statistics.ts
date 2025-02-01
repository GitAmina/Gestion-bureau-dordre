import { NextApiRequest, NextApiResponse } from "next";
import mysql, { RowDataPacket } from "mysql2/promise";

// Définir un type pour les statistiques
type Statistics = {
  total: number;
  entrants: number;
  sortants: number;
  enTraitement: number;
  archives: number;
};

// Configuration de la connexion à MySQL
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "bureau_ordre",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // console.log("Tentative de connexion à la base de données...");
    const connection = await pool.getConnection();
    // console.log("Connexion à la base de données réussie.");

    // console.log("Exécution de la requête SQL...");
    const [rows] = await connection.query<RowDataPacket[]>(`
      SELECT
        COUNT(CASE WHEN etat = 'En attente' THEN 1 END) AS enAttente,
        COUNT(CASE WHEN etat = 'Traité' THEN 1 END) AS Traite,
        COUNT(CASE WHEN etat = 'Clôturé' THEN 1 END) AS Cloture
      FROM Courrier;
    `);

    // Libérer la connexion
    connection.release();

    // Accéder aux résultats en toute sécurité
    const stats: Statistics = rows[0] as Statistics;
    // console.log("Statistiques récupérées :", stats);

    // Renvoyer les résultats
    res.status(200).json(stats);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Erreur détaillée :", err.message); // Affichez l'erreur complète dans la console
      res.status(500).json({
        error: "Erreur lors de la récupération des données",
        details: err.message, // Renvoyez le message d'erreur dans la réponse
      });
    } else {
      console.error("Erreur inconnue :", err); // Gérez les erreurs non standard
      res.status(500).json({
        error: "Erreur inconnue lors de la récupération des données",
      });
    }
  }
}
