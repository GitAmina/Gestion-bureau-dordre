import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { page } from "pdfkit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rapportId = searchParams.get("id");
    const format = searchParams.get("format")?.toLowerCase();

    // Validation des paramètres
    if (!format || (format !== "pdf" && format !== "excel")) {
      return NextResponse.json(
        { error: "Format de fichier non supporté (pdf ou excel uniquement)" },
        { status: 400 },
      );
    }
    if (!rapportId || isNaN(Number(rapportId))) {
      return NextResponse.json(
        { error: "ID de rapport invalide" },
        { status: 400 },
      );
    }

    // Génération du fichier
    if (format === "pdf") {
      return await generatePDF(rapportId);
    } else if (format === "excel") {
      return await generateExcel();
    }
  } catch (error) {
    console.error("Erreur lors de la génération du fichier :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Génération du PDF
export async function generatePDF(rapportId: string) {
  const templatePath = path.join(
    process.cwd(),
    "public",
    "template",
    "rapport",
    "rapport.html",
  );

  if (!fs.existsSync(templatePath)) {
    return NextResponse.json(
      { error: "Template HTML introuvable" },
      { status: 500 },
    );
  }

  try {
    const rapport = await prisma.rapport.findUnique({
      where: { id: Number(rapportId) },
    });
    const [
      totalUtilisateurs,
      totalCourriers,
      totalArchives,
      totalDepartements,
    ] = await Promise.all([
      prisma.utilisateur.count(),
      prisma.courrier.count(),
      prisma.archive.count(),
      prisma.departement.count(),
    ]);

    const [
      courriersEntrants,
      courriersSortants,
      courriersEnAttente,
      courriersTraites,
      courriersClotures,
    ] = await Promise.all([
      prisma.courrier.count({ where: { type: "entrant" } }),
      prisma.courrier.count({ where: { type: "sortant" } }),
      prisma.courrier.count({ where: { etat: "En attente" } }),
      prisma.courrier.count({ where: { etat: "Traité" } }),
      prisma.courrier.count({ where: { etat: "Clôturé" } }),
    ]);

    if (!rapport) {
      return NextResponse.json(
        { error: "Rapport introuvable" },
        { status: 404 },
      );
    }
    // Lire et modifier le contenu HTML
    let htmlContent = fs.readFileSync(templatePath, "utf8");
    htmlContent = htmlContent
      .replace(/{{periode}}/g, rapport.type)
      .replace(
        "{{dateGeneration}}",
        new Date(rapport.date_generation).toLocaleDateString(),
      )
      .replace("{{totalCourriers}}", String(totalCourriers || 0))
      .replace("{{totalUtilisateurs}}", String(totalUtilisateurs || 0))
      .replace("{{totalDepartements}}", String(totalDepartements || 0))
      .replace("{{totalArchives}}", String(totalArchives || 0))
      .replace("{{courriersEntrant}}", String(courriersEntrants || 0))
      .replace("{{courriersSortant}}", String(courriersSortants || 0))
      .replace("{{courriersEnAttente}}", String(courriersEnAttente || 0))
      .replace("{{courriersTraite}}", String(courriersTraites || 0))
      .replace("{{courriersCloture}}", String(courriersClotures || 0));
    // const htmlContent = htmlContent.replace("{{rapportId}}", rapportId);

    // Lancer Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    // Générer le PDF
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="rapport_statistiques.pdf"',
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF" },
      { status: 500 },
    );
  }
}

// Génération du fichier Excel
async function generateExcel() {
  try {
    //  Récupération des données
    const [
      totalUtilisateurs,
      totalCourriers,
      totalArchives,
      totalDepartements,
    ] = await Promise.all([
      prisma.utilisateur.count(),
      prisma.courrier.count(),
      prisma.archive.count(),
      prisma.departement.count(),
    ]);

    const [
      courriersEntrants,
      courriersSortants,
      courriersEnAttente,
      courriersTraites,
      courriersClotures,
    ] = await Promise.all([
      prisma.courrier.count({ where: { type: "entrant" } }),
      prisma.courrier.count({ where: { type: "sortant" } }),
      prisma.courrier.count({ where: { etat: "En attente" } }),
      prisma.courrier.count({ where: { etat: "Traité" } }),
      prisma.courrier.count({ where: { etat: "Clôturé" } }),
    ]);

    //  Création du fichier Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Statistiques");

    //  Définition des colonnes
    worksheet.columns = [
      { header: "Catégorie", key: "categorie", width: 30 },
      { header: "Valeur", key: "valeur", width: 15 },
    ];

    // Ajout des données
    const data = [
      ["Total utilisateurs", totalUtilisateurs],
      ["Total courriers", totalCourriers],
      ["Total archives", totalArchives],
      ["Total départements", totalDepartements],
      ["", ""], // Ligne vide
      [" Détails des courriers", ""],
      ["Courriers entrants", courriersEntrants],
      ["Courriers sortants", courriersSortants],
      ["Courriers en attente", courriersEnAttente],
      ["Courriers traités", courriersTraites],
      ["Courriers clôturés", courriersClotures],
    ];

    // Mise en forme et ajout des données
    data.forEach(([categorie, valeur], index) => {
      const row = worksheet.addRow({ categorie, valeur });

      // Mise en gras pour les titres
      if (index === 0 || index === 5) {
        row.font = { bold: true };
      }

      // Centrage des données
      row.alignment = { vertical: "middle", horizontal: "center" };
    });

    //  Ajout de bordures à toutes les cellules
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    //  Génération du fichier
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="rapport_statistiques.xlsx"`,
      },
    });
  } catch (error) {
    console.error(" Erreur lors de la génération du fichier Excel :", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du fichier Excel" },
      { status: 500 },
    );
  }
}
