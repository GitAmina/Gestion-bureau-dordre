import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";

const ChartThree: React.FC = () => {

  const series = [120, 90, 45, 30];  // Nouveaux chiffres pour les courriers


  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut"
    },

    colors: ["#5750F1", "#5475E5", "#8099EC", "#ADBCF2"], // Couleurs des sections
    labels: ["Entrants", "Sortants", "En traitement", "Archivés"], // Nouvelle légende

    legend: {
      show: false,
      position: "bottom"
    },

    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,

              label: "Courriers",
              fontSize: "16px",
              fontWeight: "400"
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold"
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415
          }
        }
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200
          }
        }
      }
    ]
  };

  return (
    <div
      className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            HEAD

            Statistiques des Courriers
          </h4>
        </div>
        <div>
          <DefaultSelectOption options={["Mensuel", "Annuel"]} />
          ec8f355 (init commit-statistics)
        </div>
      </div>

      <div className="mb-8">
        <div className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[350px]">
        <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
          <div className="w-full px-7.5 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue"></span>
              <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                HEAD

                <span> Entrants </span>
                <span> 120 </span>
                ec8f355 (init commit-statistics)
              </p>
            </div>
          </div>
          <div className="w-full px-7.5 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-light"></span>
              <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                HEAD
                <span> Sortants </span>
                <span> 90 </span>
                ec8f355 (init commit-statistics)
              </p>
            </div>
          </div>
          <div className="w-full px-7.5 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-light-2"></span>
              <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                HEAD


                <span> En traitement </span>
                <span> 45 </span>
                ec8f355 (init commit-statistics)
              </p>
            </div>
          </div>
          <div className="w-full px-7.5 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-light-3"></span>
              <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">

                <span> Archivés </span>
                <span> 30 </span>

              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;


// ------------------recuperer les donnees de la base de donnees-------------------------

// import { useEffect, useState } from "react";
// import ReactApexChart from "react-apexcharts";
// import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";
//
// const ChartThree: React.FC = () => {
//   const [series, setSeries] = useState<number[]>([0, 0, 0, 0]); // Données dynamiques
//   const [selectedFilter, setSelectedFilter] = useState<string>("Annuel");
//   const [loading, setLoading] = useState<boolean>(true);
//
//   // Récupérer le mois et l'année actuels
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth() + 1; // Mois actuel (1-12)
//   const currentYear = currentDate.getFullYear(); // Année actuelle
//
//   // Fonction pour récupérer les statistiques depuis l'API
//   const fetchStatistics = async () => {
//     try {
//       setLoading(true);
//
//       const url =
//         selectedFilter === "Mensuel"
//           ? `/api/statistics?month=${currentMonth}&year=${currentYear}`
//           : `/api/statistics?year=${currentYear}`;
//
//       const response = await fetch(url);
//       const data = await response.json();
//
//       if (response.ok) {
//         // Mise à jour des séries avec les valeurs récupérées
//         setSeries([
//           data.totalEntrants || 0,
//           data.totalSortants || 0,
//           data.etats.find((etat: any) => etat.etat === "en traitement")?._count.etat || 0,
//           data.etats.find((etat: any) => etat.etat === "archivé")?._count.etat || 0,
//         ]);
//       } else {
//         console.error("Erreur API:", data.error);
//       }
//     } catch (error) {
//       console.error("Erreur lors de la récupération des statistiques:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // Charger les données au montage + mise à jour toutes les 30 secondes
//   useEffect(() => {
//     fetchStatistics();
//     const interval = setInterval(fetchStatistics, 30000); // Rafraîchit toutes les 30 secondes
//     return () => clearInterval(interval);
//   }, [selectedFilter]);
//
//   // Configuration du graphique
//   const options = {
//     chart: {
//       fontFamily: "Satoshi, sans-serif",
//       type: "donut",
//     },
//     colors: ["#5750F1", "#5475E5", "#8099EC", "#ADBCF2"],
//     labels: ["Entrants", "Sortants", "En traitement", "Archivés"],
//     legend: {
//       show: false,
//       position: "bottom",
//     },
//     plotOptions: {
//       pie: {
//         donut: {
//           size: "80%",
//           background: "transparent",
//           labels: {
//             show: true,
//             total: {
//               show: true,
//               showAlways: true,
//               label: "Courriers",
//               fontSize: "16px",
//               fontWeight: "400",
//             },
//             value: {
//               show: true,
//               fontSize: "28px",
//               fontWeight: "bold",
//             },
//           },
//         },
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     responsive: [
//       { breakpoint: 2600, options: { chart: { width: 415 } } },
//       { breakpoint: 640, options: { chart: { width: 200 } } },
//     ],
//   };
//
//   return (
//     <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
//       <div className="mb-9 justify-between gap-4 sm:flex">
//         <div>
//           <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
//             Statistiques des Courriers
//           </h4>
//         </div>
//         <div>
//           <DefaultSelectOption
//             options={["Mensuel", "Annuel"]}
//             value={selectedFilter}
//             onChange={(value: string) => setSelectedFilter(value)}
//           />
//         </div>
//       </div>
//
//       {loading ? (
//         <p className="text-center text-dark dark:text-white">Chargement...</p>
//       ) : (
//         <>
//           <div className="mb-8">
//             <div className="mx-auto flex justify-center">
//               <ReactApexChart options={options} series={series} type="donut" />
//             </div>
//           </div>
//
//           <div className="mx-auto w-full max-w-[350px]">
//             <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
//               {["Entrants", "Sortants", "En traitement", "Archivés"].map(
//                 (label, index) => (
//                   <div key={label} className="w-full px-7.5 sm:w-1/2">
//                     <div className="flex w-full items-center">
//                       <span className={`mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-light-${index}`}></span>
//                       <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
//                         <span> {label} </span>
//                         <span> {series[index]} </span>
//                       </p>
//                     </div>
//                   </div>
//                 )
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };
//
// export default ChartThree;

