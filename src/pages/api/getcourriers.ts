//-------------recuperer les donnees avec prisma--------------------------

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const getWeekRange = (weekOffset = 0) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (dimanche) à 6 (samedi)

  // Calculer l'écart par rapport au lundi
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  // Début de la semaine (lundi)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + diffToMonday + weekOffset * 7);
  startDate.setHours(0, 0, 0, 0);

  // Fin de la semaine (dimanche)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { week } = req.query;
    const weekOffset = week === "last" ? -1 : 0;

    const { startDate, endDate } = getWeekRange(weekOffset);

    const courriers = await prisma.courrier.findMany({
      where: {
        OR: [
          {
            dateReception: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            dateEnvoi: {
              gte: startDate,
              lte: endDate,
            },
          },
        ],
      },
      select: {
        dateReception: true,
        dateEnvoi: true,
        type: true,
      },
    });

    const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const entrants: number[] = new Array(7).fill(0);
    const sortants: number[] = new Array(7).fill(0);

    courriers.forEach(({ dateReception, dateEnvoi, type }) => {
      let date = dateReception || dateEnvoi; // Utiliser la date disponible

      if (!date) return;

      date = new Date(date);
      const dayIndex = (date.getDay() + 6) % 7;

      if (type === "entrant") {
        entrants[dayIndex] += 1;
      } else if (type === "sortant") {
        sortants[dayIndex] += 1;
      }
    });

    // console.log("Entrants par jour :", entrants);
    // console.log("Sortants par jour :", sortants);

    res.status(200).json({
      entrants,
      sortants,
      days: daysOfWeek,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
