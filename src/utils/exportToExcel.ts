import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

const exportToExcel = (
  data: Courrier[],
  period: "Mensuel" | "Annuel",
): void => {
  const title = period === "Mensuel" ? "Rapport Mensuel" : "Rapport Annuel";
  const filteredData = filterDataByPeriod(data, period);

  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title);

  // Générer le fichier Excel
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Convertir en fichier Blob et le télécharger
  const file = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(file, `rapport_${period}.xlsx`);
};

// Fonction pour filtrer les données selon la période

const filterDataByPeriod = (data: Courrier[], period: "Mensuel" | "Annuel") => {
  const now = new Date();
  return data.filter((item) => {
    const itemDate = new Date(item.dateReception || item.dateEnvoi || now);
    return period === "Mensuel"
      ? itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
      : itemDate.getFullYear() === now.getFullYear();
  });
};
export default exportToExcel;
