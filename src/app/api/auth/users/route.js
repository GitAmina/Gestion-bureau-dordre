import { NextResponse } from "next/server";
import db from "../../../lib/db"; // Assurez-vous que la connexion MySQL est bien configurée

// Route GET : Récupérer tous les utilisateurs
export async function GET(req) {
  try {
    const [users] = await db.execute(
      "SELECT id,prenom, username, email, role FROM utilisateur"
    );
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// Route PUT : Mettre à jour le rôle d'un utilisateur
export async function PUT(req) {
  try {
    const { id, role } = await req.json();
    if (!id || !role) {
      return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
    }

    await db.execute("UPDATE utilisateur SET role = ? WHERE id = ?", [role, id]);
    return NextResponse.json({ message: "Rôle mis à jour" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}

// Route DELETE : Supprimer un utilisateur
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "ID requis" }, { status: 400 });
    }

    await db.execute("DELETE FROM utilisateur WHERE id = ?", [id]);
    return NextResponse.json({ message: "Utilisateur supprimé" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
