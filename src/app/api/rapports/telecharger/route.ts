import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format"); // "pdf" ou "excel"

  if (!format) {
    return NextResponse.json(
      { error: "Type de fichier manquant" },
      { status: 400 },
    );
  }

  if (format === "pdf") {
    return generatePDF();
  } else if (format === "excel") {
    return generateExcel();
  } else {
    return NextResponse.json(
      { error: "Type de fichier non supporté" },
      { status: 400 },
    );
  }
}

// Fonction pour générer un PDF
function generatePDF() {
  const doc = new PDFDocument();
  let buffers: Buffer[] = [];

  doc.text("Rapport Généré en PDF");
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);
    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="rapport.pdf"',
      },
    });
  });

  doc.end();
}

// 📌 Fonction pour générer un fichier Excel
async function generateExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Rapport");

  worksheet.addRow(["Titre", "Valeur"]);
  worksheet.addRow(["Exemple", "123"]);

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="rapport.xlsx"',
    },
  });
}
