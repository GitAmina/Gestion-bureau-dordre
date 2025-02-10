import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Aucune image fournie" });

    // Extraire l'image en base64
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const imageName = "chart.png";
    const imagesDir = path.join(process.cwd(), "public/images/charts");
    const filePath = path.join(imagesDir, imageName);

    try {
      // Vérifier si le dossier `images` existe, sinon le créer
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      // Sauvegarder l'image dans le dossier `public/images`
      fs.writeFileSync(filePath, base64Data, "base64");

      // Retourner le chemin de l'image
      res.status(200).json({ path: `public/images/charts/${imageName}` });
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      res
        .status(500)
        .json({ error: "Erreur lors de l'enregistrement de l'image" });
    }
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
