import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Vérifie que le chemin est correct

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Récupération des paramètres (mois et année)
    const { month, year } = req.query;
    const monthNumber = month ? parseInt(month as string) : 0;
    const yearNumber = year ? parseInt(year as string) : 0;

    // Condition de filtrage par date (si fournie)
    const whereCondition: any = {};
    if (yearNumber) {
      whereCondition.date_reception = {
        gte: new Date(yearNumber, monthNumber ? monthNumber - 1 : 0, 1), // Début du mois
        lt: new Date(yearNumber, monthNumber ? monthNumber : 12, 1), // Fin du mois
      };
    }

    //  Nombre total de courriers entrants et sortants
    const totalEntrants = await prisma.courrier.count({
      where: { ...whereCondition, type: "entrant" },
    });

    const totalSortants = await prisma.courrier.count({
      where: { ...whereCondition, type: "sortant" },
    });

    //  Statistiques par état
    const etats = await prisma.courrier.groupBy({
      by: ["etat"],
      _count: {
        etat: true,
      },
      where: whereCondition, // Appliquer le filtre
    });

    //  Réponse avec les statistiques
    res.status(200).json({
      totalEntrants,
      totalSortants,
      etats,
    });
  } catch (error) {
    console.error(" Erreur lors de la récupération des statistiques :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
