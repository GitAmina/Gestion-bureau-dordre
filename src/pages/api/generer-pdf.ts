import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    // Charger le fichier HTML depuis template/rapport/
    const filePath = path.join(process.cwd(), "template/rapport/rapport.html");
    let html = fs.readFileSync(filePath, "utf8");

    // Lancer Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Charger le HTML dans Puppeteer
    await page.setContent(html, { waitUntil: "load" });

    // Générer le PDF
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    // Envoyer le PDF directement au client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=rapport.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}
