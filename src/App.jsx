import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";


import Invcategory from "./pages/Inventory/Category/Invcategory";
import InvUom from "./pages/Inventory/UnitOfMeasure/InvUom";
import Invitem from "./pages/Inventory/Items/Invitem";
import InvJournal from "./pages/Inventory/Journals/InvJournal";
import InvTransactions from "./pages/Inventory/Transcations/InvTransactions";
import ChartOfAccounts from "./pages/Finance/COA/ChartsOfAccount";
import PostingJournal from "./pages/Finance/POST/postingJournal";
import BankLinkages from "./pages/Finance/Bank/BankLinkages";
//import Home from "./pages/Home";
//import Channel from "./pages/Channel";

import Settings from "./pages/Settings";
import Leaves from "./pages/HR/Leave";
import Login from "./pages/Auth/Login";
import Procureone from "./pages/Procurement/procureone";
import Procuretwo from "./pages/Procurement/procuretwo";
import HR from "./pages/HR/HR";
import Employees from "./pages/HR/Employees";
import Departments from "./pages/HR/Departments";
import Procument from "./pages/Procurement/Procument";
import Finance from "./pages/Finance/Finance";
import GeneralLedger from "./pages/Finance/GeneralLedger";

import InvLocation from "./pages/Inventory/locations/InvLocation";
import InventoryDashboard from "./pages/Inventory/InventoryDashboard.jsx";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login route WITHOUT Layout */}
        <Route path="/login" element={<Login />} />

        {/* All other routes WITH Layout */}
        <Route path="/" element={<Layout />}>
          {/* HR */}
          <Route path="Human Resource" element={<HR />} />
          <Route path="employees" element={<Employees/>} />
          <Route path="department" element={<Departments/>} />
          <Route path="leave" element={<Leaves />} />

          {/* Procurement */}
          <Route path="/Procurement" element={<Procument/>} />
          <Route path="alex" element={<Procureone />} />
          <Route path="maria" element={<Procuretwo />} />

          {/* Finance */}
          <Route path="Finance" element={<Finance/>} />
          <Route path="Finance/ChartsOfAccount" element={<ChartOfAccounts/>} />
          <Route path="Finance/PostingJournal" element={<PostingJournal/>} />
          <Route path="Finance/BankLinkages" element={<BankLinkages/>} />
          <Route path="Finance/GeneralLedger" element={<GeneralLedger/>} />
          <Route path="GeneralLedger/reports" element={<h1>GL Reports</h1>} />
          <Route path="GeneralLedger/settings" element={<h1>GL Settings</h1>} />

          <Route path="AccountsPayable" element={<h1>Accounts Payable</h1>} />
          <Route path="AccountsPayable/reports" element={<h1>AP Reports</h1>} />
          <Route path="AccountsPayable/settings" element={<h1>AP Settings</h1>} />
          <Route path="AccountsReceivable" element={<h1>Accounts Receivable</h1>} />
          <Route path="BudgetingForecasting" element={<h1>Budgeting & Forecasting</h1>} />
          <Route path="BankReconciliation" element={<h1>Bank Reconciliation</h1>} />
          <Route path="FinancialReporting" element={<h1>Financial Reporting</h1>} />

          {/* Inventory */}
          <Route path="Inventory" element={<InventoryDashboard/>} />
          <Route path="invcategories" element={<Invcategory/>} />
          <Route path="Invlocations" element={<InvLocation/>} />
          <Route path="invUnitOfMeasure" element={<InvUom/>} />
          <Route path="InvItems" element={<Invitem/>} />
          <Route path="InvJournals" element={<InvJournal/>} />
          <Route path="InvTransactions" element={<InvTransactions/>} />
          <Route path="StockReceipts" element={<h1>Stock Receipts</h1>} />
          <Route path="StockIssues" element={<h1>Stock Issues</h1>} />
          <Route path="TransfersbetweenWarehouses" element={<h1>Transfers between Warehouses</h1>} />
          <Route path="StockAdjustments" element={<h1>Stock Adjustments</h1>} />
          <Route path="StockReportingAndAlerts" element={<h1>Stock Reporting & Alerts</h1>} />
        </Route>
      </Routes>
    </Router>
  );
}
