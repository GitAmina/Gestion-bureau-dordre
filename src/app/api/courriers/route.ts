import mysql from "mysql2/promise";

// Créer la connexion MySQL
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "bureau_ordre",
});

interface Courrier {
  id: number;
  reference: string;
  type: "entrant" | "sortant";
  expediteur: string;
  destinataire: string;
  sujet?: string;
  etat: "En attente" | "Traité" | "Cloturé";
  date_reception?: Date;
  date_envoi?: Date;
}

// Fonction handler de l'API pour récupérer les courriers
export async function GET() {
  try {
    const [rows] = await pool.execute("SELECT * FROM Courrier");

    // Conversion des dates en objets Date
    const courriers = (rows as Courrier[]).map((courrier) => ({
      ...courrier,
      date_reception: courrier.date_reception
        ? new Date(courrier.date_reception)
        : undefined,
      date_envoi: courrier.date_envoi
        ? new Date(courrier.date_envoi)
        : undefined,
    }));

    return new Response(JSON.stringify(courriers), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response("Error fetching courriers", { status: 500 });
  }
}
