import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const courriers = await prisma.courrier.findMany({
        include: { departement: true },
      });
      console.log("Courriers récupérés :", courriers); // Ajout d'un log ici
      res.status(200).json(courriers);
    } catch (error) {
      console.error("Erreur lors de la récupération des courriers:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
