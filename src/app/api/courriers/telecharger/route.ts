import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// Configuration de la connexion à MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "bureau_ordre",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courrierId = searchParams.get("id");

    if (!courrierId || isNaN(Number(courrierId))) {
      return NextResponse.json(
        { error: "ID de courrier invalide" },
        { status: 400 },
      );
    }

    // Connexion à MySQL et récupération des informations du courrier avec le nom du département
    const connection = await mysql.createConnection(dbConfig);
    const [rows]: any[] = await connection.execute(
      `SELECT courrier.*, departement.nom AS departement_nom
       FROM courrier
       LEFT JOIN departement ON courrier.departement_id = departement.id
       WHERE courrier.id = ?`,
      [courrierId],
    );
    await connection.end();

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "Courrier introuvable" },
        { status: 404 },
      );
    }

    const courrier = rows[0];

    // Déterminer le nom du fichier PDF
    const fileName = `${courrier.fichier_numerise ?? "courrier"}.pdf`;

    // Vérifier si un template HTML existe
    const templatePath = path.join(
      process.cwd(),
      "public",
      "template",
      "courrier",
      "courrier.html",
    );
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: "Template HTML introuvable" },
        { status: 500 },
      );
    }

    // Lire et personnaliser le template HTML
    let htmlContent = fs.readFileSync(templatePath, "utf8");
    htmlContent = htmlContent
      .replace("{{reference}}", courrier.reference)
      .replace("{{expediteur}}", courrier.expediteur)
      .replace("{{destinataire}}", courrier.destinataire)
      .replace("{{sujet}}", courrier.sujet ?? "Aucun sujet")
      .replace("{{etat}}", courrier.etat)
      .replace("{{typeCourrier}}", courrier.type ?? "Non spécifié")
      .replace("{{departement}}", courrier.departement_nom ?? "Non spécifié")
      .replace("{{dateActuelle}}", new Date().toLocaleDateString())
      .replace("{{heureActuelle}}", new Date().toLocaleTimeString())
      .replace(
        "{{dateReception}}",
        courrier.date_reception
          ? new Date(courrier.date_reception).toLocaleDateString()
          : "N/A",
      )
      .replace(
        "{{dateEnvoi}}",
        courrier.date_envoi
          ? new Date(courrier.date_envoi).toLocaleDateString()
          : "N/A",
      )
      .replace("{{contenu}}", courrier.contenu ?? "Aucun contenu");

    // Lancer Puppeteer pour générer le PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
