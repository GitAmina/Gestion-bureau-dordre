import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

// Fonction pour obtenir la plage de dates d'une semaine
const getWeekRange = (weekOffset = 0) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (dimanche) à 6 (samedi)

  // Trouver le lundi de la semaine
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek + 1 + weekOffset * 7);
  startDate.setHours(0, 0, 0, 0);

  // Trouver le dimanche de la semaine
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

// Fonction pour formater les dates en YYYY-MM-DD (pour Prisma)
const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { week } = req.query;
    const weekOffset = week === "last" ? -1 : 0;

    // Déterminer la plage de dates pour la semaine choisie
    const { startDate, endDate } = getWeekRange(weekOffset);

    // Récupérer les courriers groupés par jour
    const courriers = await prisma.courrier.groupBy({
      by: ["dateReception", "type"],
      where: {
        dateReception: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
    });

    // Organiser les données par jour
    const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const entrants: number[] = new Array(7).fill(0);
    const sortants: number[] = new Array(7).fill(0);

    courriers.forEach(({ dateReception, type, _count }) => {
      if (!dateReception) return; // Vérifier si la date est nulle et ignorer cet élément

      const date = new Date(dateReception);

      if (isNaN(date.getTime())) {
        console.error("Date invalide :", dateReception);
        return;
      }

      const dayIndex = (date.getDay() + 6) % 7; // Convertir Dimanche (0) en dernier jour

      if (type === "entrant") {
        entrants[dayIndex] = _count.id;
      } else {
        sortants[dayIndex] = _count.id;
      }
    });

    res.status(200).json({
      entrants,
      sortants,
      days: daysOfWeek,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
