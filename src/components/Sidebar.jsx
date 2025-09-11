// // src/components/Sidebar.jsx
// import { Link } from "react-router-dom";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// export default function Sidebar({ collapsed, toggleSidebar }) {
//   return (
//     <div
//       className={`${
//         collapsed ? "w-16" : "w-60"
//       } bg-purple-900 text-white flex flex-col min-h-screen transition-all duration-300`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-purple-700">
//         {!collapsed && <span className="font-bold">Flatstudio</span>}
//         <button
//           onClick={toggleSidebar}
//           className="text-white hover:text-gray-300"
//         >
//           {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-2 overflow-y-auto">
//         <p className="text-xs text-gray-300 uppercase mb-2">
//           {!collapsed && "Channels"}
//         </p>
//         <ul className="space-y-1">
//           <li>
//             <Link
//               to="/channel/improve_slack"
//               className="block px-2 py-1 rounded hover:bg-purple-700"
//             >
//               {!collapsed ? "# improve_slack" : "#"}
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/channel/design_daily"
//               className="block px-2 py-1 rounded hover:bg-purple-700"
//             >
//               {!collapsed ? "# design_daily" : "#"}
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/channel/heroes"
//               className="block px-2 py-1 rounded hover:bg-purple-700"
//             >
//               {!collapsed ? "# heroes" : "#"}
//             </Link>
//           </li>
//         </ul>

//         <p className="text-xs text-gray-300 uppercase mt-4 mb-2">
//           {!collapsed && "Direct messages"}
//         </p>
//         <ul className="space-y-1">
//           <li>
//             <Link
//               to="/dm/roman"
//               className="block px-2 py-1 rounded hover:bg-purple-700"
//             >
//               {!collapsed ? "Roman Vasiliev" : "R"}
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/dm/bohdan"
//               className="block px-2 py-1 rounded hover:bg-purple-700"
//             >
//               {!collapsed ? "Bohdan Kononets" : "B"}
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// }
