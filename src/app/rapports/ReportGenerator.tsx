import { useState } from "react";
import exportToPDF from "../../utils/exportToPDF";
import exportToExcel from "@/utils/exportToExcel";

interface ReportData {
  id: number;
  name: string;
  value: number;
}

const ReportGenerator = ({ data }: { data: ReportData[] }) => {
  const [period, setPeriod] = useState("monthly");

  // const handleExportPDF = () => {
  //   exportToPDF(data, period);
  // };
  //
  // const handleExportExcel = () => {
  //   exportToExcel(data, period);
  // };

  return (
    <div className="rounded bg-white p-4 shadow">
      <h2 className="mb-3 text-xl font-bold">Générer un Rapport</h2>
      <select
        className="mb-3 rounded border p-2"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
      >
        <option value="monthly">Mensuel</option>
        <option value="yearly">Annuel</option>
      </select>
      <div className="flex gap-3">
        <button
          // onClick={handleExportPDF}
          className="rounded bg-red-500 p-2 text-white"
        >
          Exporter en PDF
        </button>
        <button
          // onClick={handleExportExcel}
          className="rounded bg-green-500 p-2 text-white"
        >
          Exporter en Excel
        </button>
      </div>
    </div>
  );
};

export default ReportGenerator;
