import { NextApiRequest, NextApiResponse } from "next";

//====================recuperer la liste des rapports de la base de donnees===================

import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Méthode non autorisée" });
    }

    // Récupérer tous les rapports de la base de données
    const rapports = await prisma.rapport.findMany({
      orderBy: { dateGeneration: "desc" }, // Trier par date de génération (du plus récent au plus ancien)
    });

    res.status(200).json(rapports);
  } catch (error) {
    console.error("Erreur lors de la récupération des rapports :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

//-------------------- Code pour générer et stocker le rapport en BDD------------------
//
// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
//
// export async function POST(req: NextRequest) {
//   try {
//     const { period, format } = await req.json();
//
//     if (!period || !format) {
//       return NextResponse.json(
//         { error: "Période et format requis" },
//         { status: 400 },
//       );
//     }
//
//     // Récupérer les courriers depuis la BDD
//     const courriers = await prisma.courrier.findMany();
//
//     // Filtrer les courriers en fonction de la période (Mensuel ou Annuel)
//     const now = new Date();
//     const filteredData = courriers.filter((item) => {
//       const itemDate = new Date(item.dateReception || item.dateEnvoi || now);
//       return period === "Mensuel"
//         ? itemDate.getMonth() === now.getMonth() &&
//             itemDate.getFullYear() === now.getFullYear()
//         : itemDate.getFullYear() === now.getFullYear();
//     });
//
//     // Stocker le rapport dans la BDD
//     const newRapport = await prisma.rapport.create({
//       data: {
//         type: period,
//         donnees: filteredData,
//         format,
//       },
//     });
//
//     return NextResponse.json({
//       message: "Rapport généré avec succès",
//       rapport: newRapport,
//     });
//   } catch (error) {
//     console.error("Erreur lors de la génération du rapport:", error);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
