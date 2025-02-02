import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Correction de l'import

interface Courrier {
  id: number;
  reference: string;
  type: string;
  expediteur: string;
  destinataire: string;
  sujet?: string;
  contenu?: string;
  etat: string;
  dateReception?: Date;
  dateEnvoi?: Date;
}

const exportToPDF = (data: Courrier[], period: "Mensuel" | "Annuel"): void => {
  const doc = new jsPDF();
  const title = period === "Mensuel" ? "Rapport Mensuel" : "Rapport Annuel";

  doc.text(title, 14, 10);

  const filteredData = filterDataByPeriod(data, period);

  // Génération du tableau
  autoTable(doc, {
    head: [["ID", "Type", "Expéditeur", "Destinataire", "Date"]],
    body: filteredData.map((item) => [
      item.id,
      item.type,
      item.expediteur,
      item.destinataire,
      item.dateReception?.toLocaleDateString() ||
        item.dateEnvoi?.toLocaleDateString() ||
        "N/A",
    ]),
  });

  doc.save(`rapport_${period}.pdf`);
};

// Fonction pour filtrer les données selon la période
const filterDataByPeriod = (data: Courrier[], period: "Mensuel" | "Annuel") => {
  const now = new Date();
  return data.filter((item) => {
    const itemDate = item.dateReception || item.dateEnvoi || new Date();
    return period === "Mensuel"
      ? itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
      : itemDate.getFullYear() === now.getFullYear();
  });
};

export default exportToPDF;

//-------------------utiliser l'API pour générer un rapport-------------------------------

// const generateRapport = async (period: "Mensuel" | "Annuel", format: "PDF" | "Excel") => {
//   try {
//     const response = await fetch("/api/rapports", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ period, format }),
//     });
//
//     const data = await response.json();
//     console.log("Rapport généré:", data);
//   } catch (error) {
//     console.error("Erreur lors de la génération du rapport:", error);
//   }
// };
