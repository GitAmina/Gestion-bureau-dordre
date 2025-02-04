//====================interroge la base de données Prisma=====================

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const totalCourriers = await prisma.courrier.count();
    const totalDepartements = await prisma.departement.count();
    const totalUtilisateurs = await prisma.utilisateur.count();
    const totalArchives = await prisma.archive.count();

    res.status(200).json({
      totalCourriers,
      totalDepartements,
      totalUtilisateurs,
      totalArchives,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des statistiques" });
  }
}
