// src/app/api/courriers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "bureau_ordre",
});

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id); // Convertir en nombre
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID invalide" }, { status: 400 });
    }

    // Vérifier si le courrier existe
    const [rows] = await pool.execute("SELECT * FROM Courrier WHERE id = ?", [
      id,
    ]);
    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { message: "Courrier non trouvé" },
        { status: 404 },
      );
    }

    // Supprimer le courrier
    await pool.execute("DELETE FROM Courrier WHERE id = ?", [id]);

    return NextResponse.json(
      { message: "Courrier supprimé avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID invalide" }, { status: 400 });
    }

    // Récupérer les données du courrier
    const [rows] = await pool.execute("SELECT * FROM Courrier WHERE id = ?", [
      id,
    ]);
    const courrier = (rows as any[])[0]; // On prend le premier résultat

    if (!courrier) {
      return NextResponse.json(
        { message: "Courrier non trouvé" },
        { status: 404 },
      );
    }

    return NextResponse.json(courrier, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID invalide" }, { status: 400 });
    }

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
      fichier_numerise,
    } = await req.json();

    // Vérifier si le courrier existe
    const [rows] = await pool.execute("SELECT * FROM Courrier WHERE id = ?", [
      id,
    ]);
    const courrier = (rows as any[])[0];

    if (!courrier) {
      return NextResponse.json(
        { message: "Courrier non trouvé" },
        { status: 404 },
      );
    }

    // Mettre à jour les informations du courrier
    await pool.execute(
      `UPDATE Courrier SET reference = ?, type = ?, etat = ?, expediteur = ?, destinataire = ?, date_envoi = ?, date_reception = ?, sujet = ?, departement_id = ?, contenu = ?, fichier_numerise = ? WHERE id = ?`,
      [
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
        fichier_numerise,
        id,
      ],
    );

    return NextResponse.json(
      { message: "Courrier mis à jour avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du courrier :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
