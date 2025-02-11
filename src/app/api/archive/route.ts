import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "bureau_ordre",
});

export async function GET() {
  try {
    const [archives] = await pool.execute(`
      SELECT a.*, c.* 
      FROM archive a 
      INNER JOIN courrier c ON a.courrier_id = c.id
      ORDER BY a.date_archivage ASC  -- Trie par date d'archivage (du plus ancien au plus récent)
    `);
    return NextResponse.json(archives);
  } catch (error) {
    console.error("Erreur lors de la récupération des archives :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { courrierId } = await req.json();

    if (!courrierId) {
      return NextResponse.json({ error: "courrierId est requis" }, { status: 400 });
    }

    // Vérifier si le courrier est déjà archivé
    const [existingArchive] = await pool.execute(
      "SELECT * FROM archive WHERE courrier_id = ?",
      [courrierId]
    );

    if ((existingArchive as any[]).length > 0) {
      return NextResponse.json({ error: "Ce courrier est déjà archivé" }, { status: 400 });
    }

    // Archiver le courrier
    const [result] = await pool.execute(
      "INSERT INTO archive (courrier_id, date_archivage) VALUES (?, NOW())",
      [courrierId]
    );

    return NextResponse.json({ success: true, archiveId: (result as any).insertId });
  } catch (error) {
    console.error("Erreur lors de l'archivage :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courrierId = searchParams.get("courrierId");

  console.log("Tentative de désarchivage du courrier ID :", courrierId);

  if (!courrierId) {
    return NextResponse.json({ error: "courrierId est requis" }, { status: 400 });
  }

  try {
    const [result] = await pool.execute("DELETE FROM archive WHERE courrier_id = ?", [courrierId]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Aucune archive trouvée" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'archive :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}



