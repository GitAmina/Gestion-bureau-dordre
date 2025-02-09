import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Méthode non autorisée" },
      { status: 405 },
    );
  }

  try {
    const body = await req.json();
    const { format, type } = body;
    const reportType = type || "Mensuel"; // "Mensuel" par défaut

    // Récupérer les statistiques des courriers
    const totalCourriers = await prisma.courrier.count();
    const courriersEntrants = await prisma.courrier.count({
      where: { type: "entrant" },
    });
    const courriersSortants = await prisma.courrier.count({
      where: { type: "sortant" },
    });
    const totalUtilisateurs = await prisma.utilisateur.count();

    // Construire les données du rapport
    const donnees = {
      total_courriers: totalCourriers,
      courriers_entrant: courriersEntrants,
      courriers_sortant: courriersSortants,
      total_utilisateurs: totalUtilisateurs,
    };

    // Insérer le rapport dans la base de données
    const newReport = await prisma.rapport.create({
      data: {
        type: reportType,
        date_generation: new Date(),
        format,
        donnees: JSON.stringify(donnees), // Stocker les données sous forme JSON
      },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la génération du rapport :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
