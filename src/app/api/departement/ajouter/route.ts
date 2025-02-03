// src/app/api/departement/ajouter/route.ts
import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "bureau_ordre",
});

export async function POST(req: NextRequest) {
  try {
    const { nom, description, responsable } = await req.json();

    if (!nom || !responsable) {
      return NextResponse.json(
        { message: "Nom et responsable sont requis" },
        { status: 400 },
      );
    }

    await pool.execute(
      `INSERT INTO Departement (nom, description, responsable_id) VALUES (?, ?, ?)`,
      [nom, description, responsable || null],
    );

    return NextResponse.json(
      { message: "Département ajouté avec succès" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout du département:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
