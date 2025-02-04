import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    // Récupérer les statistiques des courriers
    const totalCourriers = await prisma.courrier.count();
    const courriersEntrants = await prisma.courrier.count({
      where: { type: "entrant" }, // Assure-toi que "type" est bien défini dans ton modèle
    });
    const courriersSortants = await prisma.courrier.count({
      where: { type: "sortant" },
    });

    // Construire les données du rapport
    const donnees = {
      total_courriers: totalCourriers,
      courriers_entrant: courriersEntrants,
      courriers_sortant: courriersSortants,
    };

    // Déterminer le type de rapport
    const { format, type } = req.body;
    const reportType = type || "Mensuel"; // "Mensuel" par défaut

    // Insérer le rapport dans la base de données
    const newReport = await prisma.rapport.create({
      data: {
        type: reportType,
        dateGeneration: new Date(),
        format,
        donnees: JSON.stringify(donnees), // Stocker les données sous forme JSON
      },
    });

    return res.status(201).json(newReport);
  } catch (error) {
    console.error("Erreur lors de la génération du rapport :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
