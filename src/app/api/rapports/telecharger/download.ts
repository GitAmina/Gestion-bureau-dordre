import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, format } = req.query;

  if (!id || !format) {
    return res.status(400).json({ error: "ID et format requis" });
  }

  try {
    const rapport = await prisma.rapport.findUnique({
      where: { id: Number(id) },
    });
    if (!rapport) {
      return res.status(404).json({ error: "Rapport non trouvé" });
    }

    if (typeof format === "string") {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=rapport_${id}.${format.toLowerCase()}`,
      );
    }
    res.setHeader(
      "Content-Type",
      format === "PDF" ? "application/pdf" : "application/vnd.ms-excel",
    );

    res.send(rapport.donnees);
  } catch (error) {
    console.error("Erreur téléchargement :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
