//==================supprimer un rapport=========================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id); // Convertit l'ID en number

  if (isNaN(id)) {
    return NextResponse.json(
      { message: "ID de rapport invalide" },
      { status: 400 },
    );
  }

  try {
    // Vérifie si le rapport existe
    const existingReport = await prisma.rapport.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return NextResponse.json(
        { message: "Rapport non trouvé" },
        { status: 404 },
      );
    }

    // Supprime le rapport
    await prisma.rapport.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Rapport supprimé avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du rapport :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
