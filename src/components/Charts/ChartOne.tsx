// import { ApexOptions } from "apexcharts";
// import React, { useState } from "react";
// import ReactApexChart from "react-apexcharts";
// import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";
//
// const ChartOne: React.FC = () => {
//   const [viewMode, setViewMode] = useState<"weekly" | "monthly" | "yearly">(
//     "monthly",
//   );
//
//   // Données statiques en fonction du mode sélectionné
//   const getData = () => {
//     if (viewMode === "weekly") {
//       return {
//         categories: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
//         series: [
//           { name: "Courriers Entrants", data: [5, 10, 15, 7, 20, 13, 9] },
//           { name: "Courriers Sortants", data: [3, 8, 12, 5, 17, 10, 6] },
//         ],
//       };
//     } else if (viewMode === "monthly") {
//       return {
//         categories: [
//           "Jan",
//           "Fév",
//           "Mar",
//           "Avr",
//           "Mai",
//           "Juin",
//           "Juil",
//           "Août",
//           "Sept",
//           "Oct",
//           "Nov",
//           "Déc",
//         ],
//         series: [
//           {
//             name: "Courriers Entrants",
//             data: [30, 45, 60, 50, 70, 90, 85, 60, 75, 95, 80, 100],
//           },
//           {
//             name: "Courriers Sortants",
//             data: [25, 35, 50, 40, 60, 85, 70, 55, 65, 80, 75, 90],
//           },
//         ],
//       };
//     } else {
//       return {
//         categories: ["2021", "2022", "2023", "2024", "2025"],
//         series: [
//           { name: "Courriers Entrants", data: [500, 700, 800, 1000, 1100] },
//           { name: "Courriers Sortants", data: [400, 600, 750, 900, 1050] },
//         ],
//       };
//     }
//   };
//
//   const { categories, series } = getData();
//
//   const options: ApexOptions = {
//     legend: {
//       show: true,
//       position: "top",
//       horizontalAlign: "left",
//     },
//     colors: ["#5750F1", "#0ABEF9"],
//     chart: {
//       fontFamily: "Satoshi, sans-serif",
//       height: 310,
//       type: "area",
//       toolbar: {
//         show: false,
//       },
//     },
//     fill: {
//       gradient: {
//         opacityFrom: 0.55,
//         opacityTo: 0,
//       },
//     },
//     stroke: {
//       curve: "smooth",
//     },
//     markers: {
//       size: 0,
//     },
//     grid: {
//       strokeDashArray: 5,
//       yaxis: {
//         lines: { show: true },
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     xaxis: {
//       type: "category",
//       categories,
//     },
//     yaxis: {
//       title: {
//         style: { fontSize: "0px" },
//       },
//     },
//   };
//
//   return (
//     <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card ">
//       <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
//         <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
//           Évolution des Courriers
//         </h4>
//         <DefaultSelectOption
//           options={["Hebdomadaire", "Mensuel", "Annuel"]}
//           onChange={(value: String) =>
//             setViewMode(
//               value === "Hebdomadaire"
//                 ? "weekly"
//                 : value === "Mensuel"
//                   ? "monthly"
//                   : "yearly",
//             )
//           }
//         />
//       </div>
//       <ReactApexChart
//         options={options}
//         series={series}
//         type="area"
//         height={310}
//       />
//     </div>
//   );
// };
//
// export default ChartOne;

//---------------------recuperer les donnees dynamiquement-----------------

import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";
import axios from "axios";

const ChartCourriers: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [series, setSeries] = useState([
    { name: "Courriers Entrants", data: [] },
    { name: "Courriers Sortants", data: [] },
  ]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/getcourriers?timeFrame=${timeFrame}`,
        );
        setSeries([
          { name: "Courriers Entrants", data: response.data.entrants },
          { name: "Courriers Sortants", data: response.data.sortants },
        ]);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };

    fetchData();
  }, [timeFrame]);

  const options: ApexOptions = {
    legend: { show: false, position: "top", horizontalAlign: "left" },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
    },
    fill: { gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    stroke: { curve: "smooth" },
    markers: { size: 0 },
    grid: { strokeDashArray: 5 },
    dataLabels: { enabled: false },
    tooltip: {
      x: { show: false },
      y: { title: { formatter: () => "" } },
      marker: { show: false },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { title: { style: { fontSize: "0px" } } },
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card ">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
          Évolution des Courriers
        </h4>
        <DefaultSelectOption
          options={["Mensuelle", "Annuelle"]}
          onChange={(value: string) => setTimeFrame(value.toLowerCase())}
        />
      </div>
      <div className="-ml-4 -mr-5">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={310}
        />
      </div>
    </div>
  );
};

export default ChartCourriers;
