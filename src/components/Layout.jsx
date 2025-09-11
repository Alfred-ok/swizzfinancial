// // src/components/Layout.jsx
// import { useState } from "react";
// import MiniSidebar from "./MiniSidebar";
// import MainSidebar from "./MainSidebar";
// import Navbar from "./Navbar";
// import { IoIosAlbums } from "react-icons/io";
// import { GrResources } from "react-icons/gr";
// import { SiFsecure } from "react-icons/si";
// import { RiBankFill } from "react-icons/ri";
// import { MdInventory2 } from "react-icons/md";
// import bgcircle from "../assets/circle.jpg"
// import { Outlet } from "react-router-dom";

// const mockWorkspaces = [
//   {
//     id: "ws1",
//     name: "Human Resource",
//     title: "HR",
//     icon: <GrResources className="text-2xl" />,
//     dms: [
//       {
//         id: "employees",
//         name: "Employees",
//         sublinks: [
//           { id: "list", name: "List Employees" },
//           { id: "add", name: "Add Employee" },
//         ],
//       },
//       {
//         id: "department",
//         name: "Departments",
//         sublinks: [
//           { id: "overview", name: "Overview" },
//           { id: "settings", name: "Settings" },
//         ],
//       },
//       { id: "leave", name: "Leave", sublinks: [] }, // no submenu
//     ],
//   },
//   {
//     id: "ws2",
//     name: "Procurement",
//     title: "Procu..",
//     icon: <SiFsecure className="text-2xl" />,
//     dms: [
//       {
//         id: "alex",
//         name: "Procure One",
//         sublinks: [
//           { id: "overview", name: "Overview" },
//           { id: "reports", name: "Reports" },
//         ],
//       },
//       {
//         id: "maria",
//         name: "Procure Two",
//         sublinks: [
//           { id: "overview", name: "Overview" },
//           { id: "settings", name: "Settings" },
//         ],
//       },
//     ],
//   },
//   {
//     id: "ws3",
//     name: "Finance",
//     title: "Finance",
//     icon: <RiBankFill className="text-2xl" />,
//     dms: [
//       { id: "ChartsOfAccount", name: "Charts Of Account", sublinks: [] },
//       {
//         id: "GeneralLedger",
//         name: "General Ledger",
//         sublinks: [
//           { id: "reports", name: "Reports" },
//           { id: "settings", name: "Settings" },
//         ],
//       },
//       { id: "AccountsPayable", name: "Accounts Payable", sublinks: [] },
//       { id: "AccountsReceivable", name: "Accounts Receivable", sublinks: [] },
//     ],
//   },
//   {
//     id: "ws4",
//     name: "Inventory",
//     title: "Invent..",
//     icon: <MdInventory2 className="text-2xl" />,
//     dms: [
//       {
//         id: "StockReceipts",
//         name: "Stock Receipts",
//         sublinks: [
//           { id: "report", name: "Receipt Reports" },
//           { id: "history", name: "History" },
//         ],
//       },
//       { id: "StockIssues", name: "Stock Issues", sublinks: [] },
//     ],
//   },
// ];


// export default function Layout({ children }) {
//   const [activeWorkspace, setActiveWorkspace] = useState("ws1");

//   const currentWorkspace = mockWorkspaces.find(
//     (ws) => ws.id === activeWorkspace
//   );

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <div className="flex flex-1 bg-indigo-800">
//         <MiniSidebar
//           workspaces={mockWorkspaces}
//           activeWorkspace={activeWorkspace}
//           onSelect={setActiveWorkspace}
//         />
//         <MainSidebar workspace={currentWorkspace} />

//         {/* Page Content */}
//         <div
//           className="flex-1 bg-indigo-100 p-1 overflow-auto"
//           style={{
//             backgroundImage: `url(${bgcircle})`,
//             backgroundColor: "rgba(224, 231, 255, 0.7)",
//             backgroundSize: "200px",
//             backgroundBlendMode: "saturation",
//             backgroundPosition: "center",
//           }}
//         >
//           <Outlet /> {/* ✅ this shows the selected route content */}
//         </div>
//       </div>
//     </div>
//   );
// }

























import { useLocation } from "react-router-dom";
import MiniSidebar from "./MiniSidebar";
import MainSidebar from "./MainSidebar";
import Navbar from "./Navbar";
import { IoIosAlbums } from "react-icons/io";
import { GrResources } from "react-icons/gr";
import { SiFsecure } from "react-icons/si";
import { RiBankFill } from "react-icons/ri";
import { MdInventory2 } from "react-icons/md";
import bgcircle from "../assets/circle.jpg";
import { Outlet } from "react-router-dom";



const mockWorkspaces = [
  {
    id: "ws1",
    name: "Human Resource",
    title: "HR",
    icon: <GrResources className="text-2xl" />,
    dms: [
      {
        id: "employees",
        name: "Employees",
        sublinks: [
          { id: "list", name: "List Employees" },
          { id: "add", name: "Add Employee" },
        ],
      },
      {
        id: "department",
        name: "Departments",
        sublinks: [
          { id: "overview", name: "Overview" },
          { id: "settings", name: "Settings" },
        ],
      },
      { id: "leave", name: "Leave", sublinks: [] }, // no submenu
    ],
  },
  {
    id: "ws2",
    name: "Procurement",
    title: "Procu..",
    icon: <SiFsecure className="text-2xl" />,
    dms: [
      {
        id: "alex",
        name: "Procure One",
        sublinks: [
          { id: "overview", name: "Overview" },
          { id: "reports", name: "Reports" },
        ],
      },
      {
        id: "maria",
        name: "Procure Two",
        sublinks: [
          { id: "overview", name: "Overview" },
          { id: "settings", name: "Settings" },
        ],
      },
    ],
  },
  {
    id: "ws3",
    name: "Finance",
    title: "Finance",
    icon: <RiBankFill className="text-2xl" />,
    dms: [
      { id: "ChartsOfAccount", name: "Charts Of Account", sublinks: [] },
      { id: "PostingJournal", name: "Posting Journal", sublinks: [] },
      { id: "BankLinkages", name: "Bank Linkages", sublinks: [] },
      /*{
        id: "GeneralLedger",
        name: "General Ledger",
        sublinks: [
          { id: "reports", name: "Reports" },
          { id: "settings", name: "Settings" },
        ],
      },
      { id: "AccountsPayable", name: "Accounts Payable", sublinks: [] },
      { id: "AccountsReceivable", name: "Accounts Receivable", sublinks: [] },*/
    ],
  },
  {
    id: "ws4",
    name: "Inventory",
    title: "Invent..",
    icon: <MdInventory2 className="text-2xl" />,
    dms: [
     /* {
        id: "StockReceipts",
        name: "Stock Receipts",
        sublinks: [
          { id: "report", name: "Receipt Reports" },
          { id: "history", name: "History" },
        ],
      },*/

      { id: "invCategories", name: "Categories", sublinks: [] },
      { id: "invUnitOfMeasure", name: "Unit Of Measure", sublinks: [] },
      { id: "Invlocations", name: "Locations", sublinks: [] },
      { id: "InvItems", name: "Items", sublinks: [] },
      { id: "InvJournals", name: "Journals", sublinks: [] },
      { id: "InvTransactions", name: "Transactions", sublinks: [] },
    ],
  },
];

export default function Layout({ children }) {
  const location = useLocation();

  // Determine current workspace from path
  const currentWorkspace = mockWorkspaces.find((ws) =>
    location.pathname.startsWith(`/${ws.name}`) ||
    ws.dms.some((dm) =>
      location.pathname.startsWith(`/${dm.id}`)
    )
  ) || mockWorkspaces[0]; // fallback to first workspace

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 bg-indigo-800">
        <MiniSidebar
          workspaces={mockWorkspaces}
          activeWorkspace={currentWorkspace.id} // maintain active highlight
          onSelect={() => {}} // can be empty; URL drives the selection
        />
        <MainSidebar workspace={currentWorkspace} />

        {/* Page Content */}
        <div
          className="flex-1 bg-indigo-100 p-1 overflow-auto"
          style={{
            backgroundImage: `url(${bgcircle})`,
            backgroundColor: "rgba(224, 231, 255, 0.7)",
            backgroundSize: "200px",
            backgroundBlendMode: "saturation",
            backgroundPosition: "center",
          }}
        >
          <Outlet /> {/* Shows the selected route content */}
        </div>
      </div>
    </div>
  );
}
