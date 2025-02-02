// import { ApexOptions } from "apexcharts";
// import React from "react";
// import ReactApexChart from "react-apexcharts";
// import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";
//
// const ChartTwo: React.FC = () => {
//   const series = [
//     {
//       name: "Courriers Entrants",
//       data: [44, 55, 41, 67, 22, 43, 65],
//     },
//     {
//       name: "Courriers Sortants",
//       data: [13, 23, 20, 8, 13, 27, 15],
//     },
//   ];
//
//   const options: ApexOptions = {
//     colors: ["#5750F1", "#0ABEF9"],
//     chart: {
//       fontFamily: "Satoshi, sans-serif",
//       type: "bar",
//       height: 335,
//       stacked: false, // Désactiver l'empilement
//       toolbar: {
//         show: false,
//       },
//       zoom: {
//         enabled: false,
//       },
//     },
//
//     responsive: [
//       {
//         breakpoint: 1536,
//         options: {
//           plotOptions: {
//             bar: {
//               borderRadius: 3,
//               columnWidth: "40%", // Augmenter la largeur pour espacer les groupes
//             },
//           },
//         },
//       },
//     ],
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         borderRadius: 3,
//         columnWidth: "40%", // Augmenter la largeur pour une meilleure lisibilité
//         borderRadiusApplication: "end",
//         borderRadiusWhenStacked: "last",
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//
//     grid: {
//       strokeDashArray: 5,
//       xaxis: {
//         lines: {
//           show: false,
//         },
//       },
//       yaxis: {
//         lines: {
//           show: true,
//         },
//       },
//     },
//
//     xaxis: {
//       categories: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
//     },
//     legend: {
//       position: "top",
//       horizontalAlign: "left",
//       fontFamily: "Satoshi",
//       fontWeight: 500,
//       fontSize: "14px",
//
//       markers: {
//         radius: 99,
//         width: 16,
//         height: 16,
//         strokeWidth: 10,
//         strokeColor: "transparent",
//       },
//     },
//     fill: {
//       opacity: 1,
//     },
//   };
//
//   return (
//     <div className="col-span-12 rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
//       <div className="mb-15 justify-between gap-4 sm:flex">
//         <div>
//           <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
//             Courriers Entrants et Sortants
//           </h4>
//         </div>
//         <div>
//           <DefaultSelectOption
//             options={["Cette Semaine", "Semaine Dernière"]}
//           />
//         </div>
//       </div>
//
//       <div>
//         <div id="chartTwo" className="-ml-3.5">
//           <ReactApexChart
//             options={options}
//             series={series}
//             type="bar"
//             height={370}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default ChartTwo;

//-----------------------------Recuperer les donnees de la BD---------------------

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";

const ChartTwo: React.FC = () => {
  const [data, setData] = useState({ entrants: [], sortants: [], days: [] });
  const [selectedWeek, setSelectedWeek] = useState("current"); // Semaine actuelle par défaut

  useEffect(() => {
    console.log("useEffect exécuté !");
    fetch(
      `/api/getcourriers?week=${selectedWeek === "last" ? "last" : "current"}`,
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Données récupérées :", data); // Vérifier la structure des données
        setData(data);
      })
      .catch((err) => console.error("Erreur de récupération:", err));
  }, [selectedWeek]);

  const series = [
    { name: "Courriers Entrants", data: data.entrants },
    { name: "Courriers Sortants", data: data.sortants },
  ];

  const options: ApexOptions = {
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      type: "bar",
      height: 335,
      stacked: false,
      toolbar: { show: false },
    },
    plotOptions: { bar: { columnWidth: "40%" } },
    xaxis: { categories: data.days },
    legend: { position: "top" },
    fill: { opacity: 1 },
  };

  console.log("📈 ChartTwo est bien monté !");
  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7 ">
      <div className="mb-15 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            Courriers Entrants et Sortants
          </h4>
        </div>
        <div>
          <DefaultSelectOption
            options={["Cette Semaine", "Semaine Dernière"]}
            onChange={(value: string) =>
              setSelectedWeek(value === "Semaine Dernière" ? "last" : "current")
            }
          />
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-3.5">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={370}
          />
        </div>
      </div>
    </div>
  );
};
console.log("📈 ChartTwo est bien monté !");
export default ChartTwo;
