// src/app/api/utilisateur/route.ts
import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "bureau_ordre",
});

export async function GET(req: NextRequest) {
  try {
    const [utilisateurs] = await pool.execute(`
      SELECT id, username, role FROM Utilisateur
    `);

    return NextResponse.json(utilisateurs, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
