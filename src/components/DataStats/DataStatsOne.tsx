//===============donnees statiques =============================

// import React from "react";
// import { dataStats } from "@/types/dataStats";
//
// const dataStatsList = [
//   {
//     icon: (
//       <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M3 5H23C24.1 5 25 5.9 25 7V19C25 20.1 24.1 21 23 21H3C1.9 21 1 20.1 1 19V7C1 5.9 1.9 5 3 5Z"
//               stroke="white" stroke-width="2" />
//         <path d="M1 7L13 15L25 7" stroke="white" stroke-width="2" />
//       </svg>
//
//     ),
//     color: "#3FD97F",
//     title: "Total Courriers",
//     value: "1.245K",
//     growthRate: 1.23
//   },
//   {
//     icon: (
//       <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <path d="M5 22V10L13 4L21 10V22H16V16H10V22H5Z" stroke="white" stroke-width="2" />
//       </svg>
//     ),
//     color: "#FF9C55",
//     title: "Total Départements",
//     value: "32",
//     growthRate: 0.75
//   },
//   {
//     icon: (
//       <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <circle cx="13" cy="8" r="4" stroke="white" strokeWidth="2" />
//         <path d="M4 22C4 17.5 8 15 13 15C18 15 22 17.5 22 22" stroke="white" strokeWidth="2" />
//       </svg>
//     ),
//     color: "#18BFFF",
//     title: "Total Utilisateurs",
//     value: "5.678",
//     growthRate: 2.15,
//   },
//   {
//     icon: (
//       <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <rect x="4" y="5" width="18" height="14" stroke="white" stroke-width="2" />
//         <path d="M4 10H22" stroke="white" stroke-width="2" />
//         <rect x="10" y="12" width="6" height="3" fill="white" />
//       </svg>
//     ),
//     color: "#8155FF",
//     title: "Total Archives",
//     value: "980",
//     growthRate: -1.05
//   },
// ];
//
// const DataStatsOne: React.FC<dataStats> = () => {
//   return (
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
//       {dataStatsList.map((item, index) => (
//         <div key={index} className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
//           <div className="flex h-14.5 w-14.5 items-center justify-center rounded-full" style={{ backgroundColor: item.color }}>
//             {item.icon}
//           </div>
//
//           <div className="mt-6 flex items-end justify-between">
//             <div>
//               <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">{item.value}</h4>
//               <span className="text-body-sm font-medium">{item.title}</span>
//             </div>
//
//             <span className={`flex items-center gap-1.5 text-body-sm font-medium ${item.growthRate > 0 ? "text-green" : "text-red"}`}>
//               {item.growthRate}%
//               {item.growthRate > 0 ? (
//                 <svg className="fill-current" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M4.35716 2.3925L0.908974 5.745L5.0443e-07 4.86125L5 -5.1656e-07L10 4.86125L9.09103 5.745L5.64284 2.3925L5.64284 10L4.35716 10L4.35716 2.3925Z" fill="" />
//                 </svg>
//               ) : (
//                 <svg className="fill-current" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M5.64284 7.6075L9.09102 4.255L10 5.13875L5 10L-8.98488e-07 5.13875L0.908973 4.255L4.35716 7.6075L4.35716 7.6183e-07L5.64284 9.86625e-07L5.64284 7.6075Z" fill="" />
//                 </svg>
//               )}
//             </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };
//
// export default DataStatsOne;

//==============donnees dynamiques =============================
import React, { useEffect, useState } from "react";
import axios from "axios";

const DataStatsOne = () => {
  const [stats, setStats] = useState({
    totalCourriers: 0,
    totalDepartements: 0,
    totalUtilisateurs: 0,
    totalArchives: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/stats");
        setStats(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des statistiques");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Chargement des statistiques...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const dataStatsList = [
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 5H23C24.1 5 25 5.9 25 7V19C25 20.1 24.1 21 23 21H3C1.9 21 1 20.1 1 19V7C1 5.9 1.9 5 3 5Z"
            stroke="white"
            strokeWidth="2"
          />
          <path d="M1 7L13 15L25 7" stroke="white" strokeWidth="2" />
        </svg>
      ),
      color: "#3FD97F",
      title: "Total Courriers",
      value: stats.totalCourriers,
      growthRate: 1.23,
    },
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 22V10L13 4L21 10V22H16V16H10V22H5Z"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      ),
      color: "#FF9C55",
      title: "Total Départements",
      value: stats.totalDepartements,
      growthRate: 0.75,
    },
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="13" cy="8" r="4" stroke="white" strokeWidth="2" />
          <path
            d="M4 22C4 17.5 8 15 13 15C18 15 22 17.5 22 22"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      ),
      color: "#18BFFF",
      title: "Total Utilisateurs",
      value: stats.totalUtilisateurs,
    },
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4"
            y="5"
            width="18"
            height="14"
            stroke="white"
            strokeWidth="2"
          />
          <path d="M4 10H22" stroke="white" strokeWidth="2" />
          <rect x="10" y="12" width="6" height="3" fill="white" />
        </svg>
      ),
      color: "#8155FF",
      title: "Total Archives",
      value: stats.totalArchives,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {dataStatsList.map((item, index) => (
        <div
          key={index}
          className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
        >
          <div
            className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
            style={{ backgroundColor: item.color }}
          >
            {item.icon}
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                {item.value}
              </h4>
              <span className="text-body-sm font-medium">{item.title}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataStatsOne;
