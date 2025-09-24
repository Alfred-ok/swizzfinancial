
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
        id: "HR/payrollsetup",
        name: "Payroll Setup",
        sublinks: [],
      },
      {
        id: "HR/statutorysetup",
        name: "Statutory Setup",
        sublinks: [],
      },
    ],
  },
  {
    id: "ws2",
    name: "Procurement",
    title: "Procu..",
    icon: <SiFsecure className="text-2xl" />,
    dms: [
      {
        id: "Procurement/Vendors",
        name: "Vendors",
        sublinks: []
      },
      {
        id: "Procurement/requisitions",
        name: "Requisitions",
        sublinks: []
      },
      {
        id: "Procurement/StoreRequisitions",
        name: "Store Requisitions",
        sublinks: []
      },
      {
        id: "Procurement/PurchaseOrder",
        name: "Purchase Order",
        sublinks: []
      },
      
      /*{
        id: "maria",
        name: "Procure Two",
        sublinks: [
          { id: "overview", name: "Overview" },
          { id: "settings", name: "Settings" },
        ],
      },*/
    ],
  },
  {
    id: "ws3",
    name: "Finance",
    title: "Finance",
    icon: <RiBankFill className="text-2xl" />,
    dms: [
      {    
        id:"Finance",  
        name: "Setup",
        sublinks: [
          { id: "BanksSetup", name: "Banks Setup" },
          { id: "AccountConfiguration", name: "Accounts Configuration" },
        ],
      },
     
      { id: "Finance/ChartsOfAccount", name: "Charts Of Account", sublinks: [] },
      { id: "Finance/PostingJournal", name: "Posting Journal", sublinks: [] },
      { id: "Finance/PurchaseInvoices", name: "Purchase Invoices", sublinks: [] },
      { id: "Finance/PurchaseCreditMemo", name: "Purchase Credit Memo", sublinks: [] },
      //{ id: "Finance/BankLinkages", name: "Bank Linkages", sublinks: [] },
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

      { id: "Inventory/invCategories", name: "Categories", sublinks: [] },
      { id: "Inventory/invUnitOfMeasure", name: "Unit Of Measure", sublinks: [] },
      { id: "Inventory/Invlocations", name: "Locations", sublinks: [] },
      { id: "Inventory/InvItems", name: "Items", sublinks: [] },
      { id: "Inventory/InvJournals", name: "Journals", sublinks: [] },
      { id: "Inventory/InvTransactions", name: "Transactions", sublinks: [] },
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
