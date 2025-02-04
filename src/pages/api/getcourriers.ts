//-------------recuperer les donnees avec prisma--------------------------

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Assure-toi que Prisma est bien configuré

let startDate, endDate;
// Fonction pour récupérer la plage de dates d'une semaine
const getWeekRange = (weekOffset = 0) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (dimanche) à 6 (samedi)
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

// Gestionnaire API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { timeFrame, week } = req.query;

    if (week) {
      // --- 📆 Gestion des statistiques hebdomadaires ---
      const weekOffset = week === "last" ? -1 : 0;
      const { startDate, endDate } = getWeekRange(weekOffset);

      const courriers = await prisma.courrier.findMany({
        where: {
          OR: [
            { dateReception: { gte: startDate, lte: endDate } },
            { dateEnvoi: { gte: startDate, lte: endDate } },
          ],
        },
        select: { dateReception: true, dateEnvoi: true, type: true },
      });

      const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
      const entrants: number[] = new Array(7).fill(0);
      const sortants: number[] = new Array(7).fill(0);

      courriers.forEach(({ dateReception, dateEnvoi, type }) => {
        let date = dateReception || dateEnvoi;
        if (!date) return;

        date = new Date(date);
        const dayIndex = (date.getDay() + 6) % 7;

        if (type === "entrant") entrants[dayIndex] += 1;
        if (type === "sortant") sortants[dayIndex] += 1;
      });

      return res.status(200).json({ entrants, sortants, days: daysOfWeek });
    }

    if (timeFrame) {
      // --- 📊 Gestion des statistiques mensuelles et annuelles ---
      if (timeFrame === "monthly") {
        const year = new Date().getFullYear();
        startDate = new Date(year, 0, 1); // 1er Janvier
        endDate = new Date(year, 11, 31, 23, 59, 59, 999); // 31 Décembre
      } else if (timeFrame === "yearly") {
        startDate = new Date(2000, 0, 1); // Année minimale
        endDate = new Date(); // Aujourd'hui
      } else {
        return res
          .status(400)
          .json({ error: "timeFrame invalide (monthly ou yearly requis)" });
      }

      const courriers = await prisma.courrier.findMany({
        where: {
          OR: [
            { dateReception: { gte: startDate, lte: endDate } },
            { dateEnvoi: { gte: startDate, lte: endDate } },
          ],
        },
        select: {
          dateReception: true,
          dateEnvoi: true,
          type: true,
        },
      });

      let categories: string[] = [];
      let entrants: Record<string, number> = {};
      let sortants: Record<string, number> = {};

      if (timeFrame === "monthly") {
        categories = [
          "Jan",
          "Fév",
          "Mar",
          "Avr",
          "Mai",
          "Juin",
          "Juil",
          "Août",
          "Sept",
          "Oct",
          "Nov",
          "Déc",
        ];
      } else if (timeFrame === "yearly") {
        const years = new Set();
        courriers.forEach(({ dateReception, dateEnvoi }) => {
          const date = dateReception || dateEnvoi;
          if (date) years.add(new Date(date).getFullYear());
        });
        categories = Array.from(years).sort().map(String);
      }

      categories.forEach((category) => {
        entrants[category] = 0;
        sortants[category] = 0;
      });

      courriers.forEach(({ dateReception, dateEnvoi, type }) => {
        let date = dateReception || dateEnvoi;
        if (!date) return;
        date = new Date(date);

        let key;
        if (timeFrame === "monthly") {
          key = categories[date.getMonth()];
        } else if (timeFrame === "yearly") {
          key = date.getFullYear().toString();
        }

        if (key && key in entrants) {
          if (type === "entrant") entrants[key] += 1;
          else if (type === "sortant") sortants[key] += 1;
        }
      });

      res.status(200).json({
        categories,
        entrants: Object.values(entrants),
        sortants: Object.values(sortants),
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
