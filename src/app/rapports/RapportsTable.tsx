"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

type Report = {
  id: string;
  type: string;
  dateGeneration: string;
  format: string;
};

const RapportsTable = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedType, setSelectedType] = useState<"Mensuel" | "Annuel">(
    "Mensuel",
  );
  const [selectedFormat, setSelectedFormat] = useState<"PDF" | "Excel">("PDF");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/rapports");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/generateReport", {
        format: selectedFormat,
        type: selectedType,
      });

      setReports((prev) => [response.data, ...prev]); // Ajouter le rapport à la liste
    } catch (error) {
      console.error("Erreur lors de la génération du rapport :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Liste des rapports" />

      {/* Header avec bouton de génération */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark dark:text-white">
          Rapports Générés
        </h3>
        <div className="flex space-x-4">
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as "Mensuel" | "Annuel")
            }
            className="rounded-md border border-gray-300 p-2 text-dark dark:bg-dark-3 dark:text-white"
          >
            <option value="Mensuel">Mensuel</option>
            <option value="Annuel">Annuel</option>
          </select>

          <select
            className="rounded-md border bg-white px-4 py-2 text-dark dark:bg-gray-dark dark:text-white"
            value={selectedFormat}
            onChange={(e) =>
              setSelectedFormat(e.target.value as "PDF" | "Excel")
            }
          >
            <option value="PDF">PDF</option>
            <option value="Excel">Excel</option>
          </select>
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="hover:bg-primary-dark rounded-md bg-primary px-4 py-2 text-white disabled:bg-gray-400"
          >
            {loading ? "Génération..." : "Générer un rapport"}
          </button>
        </div>
      </div>

      {/* Tableau des rapports */}
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
                <th className="px-4 py-4 font-medium text-dark dark:text-white">
                  Type de Rapport
                </th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">
                  Date de Génération
                </th>
                <th className="px-4 py-4 font-medium text-dark dark:text-white">
                  Format
                </th>
                <th className="px-4 py-4 text-right font-medium text-dark dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report.id}>
                  <td className="border-b px-4 py-4 dark:border-dark-3">
                    {report.type}
                  </td>
                  <td className="border-b px-4 py-4 dark:border-dark-3">
                    {new Date(report.dateGeneration).toLocaleDateString()}
                  </td>
                  <td className="border-b px-4 py-4 dark:border-dark-3">
                    <span
                      className={`rounded-full px-3.5 py-1 font-medium ${
                        report.format === "PDF"
                          ? "bg-[#FFA70B]/[0.08] text-[#FFA70B]"
                          : "bg-[#219653]/[0.08] text-[#219653]"
                      }`}
                    >
                      {report.format}
                    </span>
                  </td>
                  <td className="border-b px-4 py-4 text-right dark:border-dark-3">
                    <button className="hover:text-primary">
                      <svg
                        className="fill-current text-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 4C7.5 4 3.5 7 1 12C3.5 17 7.5 20 12 20C16.5 20 20.5 17 23 12C20.5 7 16.5 4 12 4Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                      </svg>
                    </button>

                    <button className="hover:text-primary">
                      <svg
                        className="fill-current text-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 3V14"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 10L12 14L16 10"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 19H19"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    Aucun rapport disponible.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RapportsTable;
