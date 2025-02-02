// src/app/api/courriers/[id]/departement/route.ts
import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "bureau_ordre",
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID invalide" }, { status: 400 });
    }

    // Récupérer le département du courrier
    const [rows] = await pool.execute(
      `SELECT d.nom FROM Departement d
       INNER JOIN Courrier c ON c.departement_id = d.id
       WHERE c.id = ?`,
      [id],
    );

    const departement = (rows as any[])[0];
    if (!departement) {
      return NextResponse.json(
        { message: "Département non trouvé pour ce courrier" },
        { status: 404 },
      );
    }

    return NextResponse.json(departement, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du département :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
