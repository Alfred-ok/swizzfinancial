import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FaBook,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function InvTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [txnDetail, setTxnDetail] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // fetch all transactions
  const fetchTransactions = () => {
    fetch(`${import.meta.env.VITE_APP_INV_URL}/api/inventory-transactions`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // fetch single transaction for drawer
  const fetchTransactionById = (id) => {
    fetch(`${import.meta.env.VITE_APP_INV_URL}/api/inventory-transactions/${id}`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        setTxnDetail(data);
        setDrawerOpen(true);
      })
      .catch(() => setTxnDetail(null));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleViewDetails = (txn) => {
    fetchTransactionById(txn.Id);
  };

  return (
    <div className="bg-white m-8 px-8 py-8 shadow-2xl rounded-lg relative flex">
      {/* Transactions List */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaBook /> Inventory Transactions
          </h2>
        </div>

        {/* Table */}
        <div className="bg-gray-200 p-4 rounded-sm">
          <div className="grid grid-cols-6 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
            <span>Document No</span>
            <span>Entry Type</span>
            <span>Quantity</span>
            {/*<span>Unit Cost</span>*/}
            <span>Date</span>
            <span className="text-right">Actions</span>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.map((txn) => (
                <div
                  key={txn.Id}
                  className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border-2`}
                >
                  <div className="grid grid-cols-6 gap-4 items-center py-4 px-6">
                    <span>{txn.DocumentNo}</span>
                    <span>{txn.EntryType}</span>
                    <span>{txn.Quantity}</span>
                    {/*<span>{txn.UnitCost}</span>*/}
                    <span>
                      {new Date(txn.TransactionDate).toLocaleDateString()}
                    </span>

                    <div className="flex justify-end gap-2 flex-wrap">
                      
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 hover:text-white text-white"
                            onClick={() => handleViewDetails(txn)}
                          >
                            Actions
                          </Button>
                        

                      {/* Expand toggle */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-600 hover:bg-gray-500 text-white"
                        onClick={() =>
                          setExpanded((prev) => ({
                            ...prev,
                            [txn.Id]: !prev[txn.Id],
                          }))
                        }
                      >
                        {expanded[txn.Id] ? <FaChevronUp /> : <FaChevronDown />}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded row */}
                  {expanded[txn.Id] && (
                    <div className="px-3 py-3 text-sm bg-gray-300 border-t mt-2 rounded-b-lg">
                      <p className="p-3 border rounded-lg bg-white m-1 mb-2">
                        <strong>Location:</strong> {txn.LocationId}
                      </p>
                      <p className="p-3 border rounded-lg bg-white m-1 mb-2">
                        <strong>Total Cost:</strong> {txn.TotalCost}
                      </p>
                      <p className="p-3 border rounded-lg bg-white m-1 mb-2">
                        <strong>Reference Journal:</strong> {txn.ReferenceJournalId}
                      </p>
                      <p className="p-3 border rounded-lg bg-white m-1 mb-2">
                        <strong>Created By:</strong> {txn.CreatedBy}
                      </p>
                      <p className="p-3 border rounded-lg bg-white m-1 mb-2">
                        <strong>Created Date:</strong>{" "}
                        {new Date(txn.CreatedDate).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-4">No transactions found.</p>
          )}
        </div>
      </div>

      {/* Drawer for Transaction Details */}
      <AnimatePresence>
        {drawerOpen && txnDetail && (
          <>
            <motion.div
              className="fixed inset-0 bg-black z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="fixed top-5 right-5 w-[480px] bg-white shadow-xl z-50 flex flex-col rounded-2xl p-3"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-4 flex justify-between items-center bg-indigo-600 rounded-2xl m-2">
                <h2 className="font-bold text-lg text-white">Transaction Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDrawerOpen(false)}
                >
                  Close
                </Button>
              </div>

              <div className="p-3 flex-1 overflow-y-auto">
                <div className="space-y-3">
                  <p><strong>Document No:</strong> {txnDetail.DocumentNo}</p>
                  <p><strong>Entry Type:</strong> {txnDetail.EntryType}</p>
                  <p><strong>Quantity:</strong> {txnDetail.Quantity}</p>
                  <p><strong>Unit Cost:</strong> {txnDetail.UnitCost}</p>
                  <p><strong>Total Cost:</strong> {txnDetail.TotalCost}</p>
                  <p><strong>Location:</strong> {txnDetail.LocationId}</p>
                  <p><strong>Reference Journal:</strong> {txnDetail.ReferenceJournalId}</p>
                  <p><strong>Created By:</strong> {txnDetail.CreatedBy}</p>
                  <p><strong>Created Date:</strong> {new Date(txnDetail.CreatedDate).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
