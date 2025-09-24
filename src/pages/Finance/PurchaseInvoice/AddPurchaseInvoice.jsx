

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import { FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoIosArrowDropleftCircle } from "react-icons/io";

export default function AddPurchaseInvoiceDrawer({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    //No: "",
    VendorNo: "",
    VendorName: "",
    VendorAddress: "",
    DocumentDate: new Date().toISOString().split("T")[0],
    PostingDate: new Date().toISOString().split("T")[0],
    DueDate: new Date().toISOString().split("T")[0],
    ApprovalStatus: "",
    PurchaseInvoiceLines: [
      {
        type: "",
        DebitChartOfAccountId: "",
        Description: "",
        quantity: "",
        unitCost: "",
        totalAmount: "",
      },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [showLinesDrawer, setShowLinesDrawer] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [invoiceTypes, setInvoiceTypes] = useState([]);
  const [purchaseInvoiceTypes, setPurchaseInvoiceTypes] = useState([]);
  const [chartOfAccounts, setChartOfAccounts] = useState([]);

  const handleLineChange = (index, field, value) => {
    const updatedLines = [...formData.PurchaseInvoiceLines];
    updatedLines[index][field] =
      field === "quantity" || field === "unitCost" || field === "totalAmount"
        ? parseFloat(value) || 0
        : value;

    setFormData({
      ...formData,
      PurchaseInvoiceLines: updatedLines,
    });
  };


  const addLine = () => {
    setFormData({
      ...formData,
      PurchaseInvoiceLines: [
        ...formData.PurchaseInvoiceLines,
        {
          type: "",
          DebitChartOfAccountId: "",
          Description: "",
          quantity: "",
          unitCost: "",
          totalAmount: "",
        },
      ],
    });
    setExpandedIndex(formData.PurchaseInvoiceLines.length);
  };

  const removeLine = (index) => {
    const updatedLines = formData.PurchaseInvoiceLines.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, PurchaseInvoiceLines: updatedLines });
    setExpandedIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_FIN_URL}/api/values/AddPurchaseInvoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to add purchase invoice");

      Swal.fire("Success", data.message, "success");

      // reset form
      setFormData({
        No: "",
        VendorNo: "",
        VendorName: "",
        VendorAddress: "",
        DocumentDate: new Date().toISOString().split("T")[0],
        PostingDate: new Date().toISOString().split("T")[0],
        DueDate: new Date().toISOString().split("T")[0],
        ApprovalStatus: "",
        PurchaseInvoiceLines: [
          {
            type: "",
            DebitChartOfAccountId: 0,
            Description: "",
            quantity: "",
            unitCost: "",
            totalAmount: "",
            //debitChartOfAccountId: ""
          },
        ],
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showLinesDrawer && formData.PurchaseInvoiceLines.length > 0) {
      setExpandedIndex(0);
    }
  }, [showLinesDrawer, formData.PurchaseInvoiceLines.length]);

  useEffect(() => {
    // Fetch Purchase Invoice Types
    fetch(`${import.meta.env.VITE_APP_FIN_URL}/api/values/GetPurchaseInvoiceEntryTypes`,{
       headers: { "ngrok-skip-browser-warning": "true" }
    })
    .then((res) => res.json())
    .then((data) => setPurchaseInvoiceTypes(data))
    .catch((err) => console.error("Error fetching invoice types:", err));


    // Fetch Chart of Accounts
   fetch(`${import.meta.env.VITE_APP_FIN_URL}/api/values/GetChartOfAccount`, {
  headers: { "ngrok-skip-browser-warning": "true" },
})
  .then((res) => res.json())
  .then((data) => {
    const accounts = Array.isArray(data) ? data : data.Data || [];
    setChartOfAccounts(accounts);
  })
  .catch((err) => {
    console.error("Error fetching chart of accounts:", err);
    setChartOfAccounts([]);
  });


  }, []);

  
  //console.log(chartOfAccounts)
  //console.log(purchaseInvoiceTypes)

  console.log(formData);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />/

          {/* Drawer */}
          <motion.div
            className="fixed top-5 right-3 w-[500px] bg-white shadow-xl z-50 flex flex-col rounded-2xl p-3"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-4 flex justify-between items-center bg-indigo-600 rounded-2xl m-2">
              <h2 className="font-bold text-lg text-white">
                Add Purchase Invoice
              </h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>

            <div className="p-3 flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Vendor No</Label>
                  <Input
                    type="number"
                    value={formData.VendorNo}
                    onChange={(e) =>
                      setFormData({ ...formData, VendorNo: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Vendor Name</Label>
                  <Input
                    value={formData.VendorName}
                    onChange={(e) =>
                      setFormData({ ...formData, VendorName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Vendor Address</Label>
                  <Input
                    value={formData.VendorAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, VendorAddress: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <div>
                    <Label>Document Date</Label>
                    <Input
                      type="date"
                      value={formData.DocumentDate}
                      onChange={(e) =>
                        setFormData({ ...formData, DocumentDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Posting Date</Label>
                    <Input
                      type="date"
                      value={formData.PostingDate}
                      onChange={(e) =>
                        setFormData({ ...formData, PostingDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={formData.DueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, DueDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                

                 <Select
                    value={formData.ApprovalStatus}
                    onValueChange={(value) =>
                        setFormData({ ...formData, ApprovalStatus: value })
                    }
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                    </Select>


                <Button
                  type="button"
                  onClick={() => setShowLinesDrawer(true)}
                  className="bg-gray-700 w-full flex justify-between gap-2"
                >
                  <IoIosArrowDropleftCircle /> Add Invoice Lines (
                  {formData.PurchaseInvoiceLines.length})
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? "Saving..." : "Save Purchase Invoice"}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Lines Drawer */}
          <AnimatePresence>
            {showLinesDrawer && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black z-48"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowLinesDrawer(false)}
                />
                <motion.div
                  className="fixed top-5 right-[520px] w-[450px] max-h-[90vh] bg-white shadow-xl z-48 flex flex-col rounded-2xl p-3"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="p-4 flex justify-between items-center bg-indigo-600 rounded-2xl m-2">
                    <h2 className="font-bold text-lg text-white">
                      Invoice Lines
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLinesDrawer(false)}
                    >
                      Close
                    </Button>
                  </div>

                  <div className="p-3 flex-1 overflow-y-auto space-y-2">
                    {formData.PurchaseInvoiceLines.map((line, idx) => (
                      <div key={idx} className="border rounded-lg">
                        <div
                          className="flex justify-between items-center p-2 bg-gray-100 cursor-pointer"
                          onClick={() =>
                            setExpandedIndex(
                              expandedIndex === idx ? null : idx
                            )
                          }
                        >
                          <span className="font-semibold">
                            Line {idx + 1} - {line.Description || "New Line"}
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLine(idx);
                              }}
                            >
                              <FaTrash />
                            </button>
                            {expandedIndex === idx ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </div>
                        </div>

                        <AnimatePresence>
                          {expandedIndex === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden p-2 space-y-2"
                            >
                              
                              <div>
                                <Select
                                    value={line.type || ""}
                                    onValueChange={(val) => handleLineChange(idx, "type", val)}
                                    >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {purchaseInvoiceTypes.map((t) => (
                                        <SelectItem key={t.Value} value={t.Value}>
                                            {t.Text}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>

                                </div>
                                <Select
                                value={line.DebitChartOfAccountId || ""}
                                onValueChange={(value) => handleLineChange(idx, "DebitChartOfAccountId", value)}
                                >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Account" />
                                </SelectTrigger>
                                <SelectContent className="max-h-100 overflow-y-auto">
                                    {chartOfAccounts.map((acc, index) => (
                                    <SelectItem key={`${acc.Id}-${index}`} value={String(acc.Id)}>
                                        {acc.AccountName}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>


                              <Input
                                placeholder="Description"
                                value={line.Description}
                                onChange={(e) =>
                                  handleLineChange(
                                    idx,
                                    "Description",
                                    e.target.value
                                  )
                                }
                              />
                              <Input
                                type="number"
                                placeholder="Quantity"
                                value={line.quantity}
                                onChange={(e) =>
                                  handleLineChange(
                                    idx,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                              />
                              <Input
                                type="number"
                                placeholder="Unit Cost"
                                value={line.unitCost}
                                onChange={(e) =>
                                  handleLineChange(
                                    idx,
                                    "unitCost",
                                    e.target.value
                                  )
                                }
                              />
                              <Input
                                type="number"
                                placeholder="Total Amount"
                                value={line.totalAmount}
                                onChange={(e) =>
                                  handleLineChange(
                                    idx,
                                    "totalAmount",
                                    e.target.value
                                  )
                                }
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}

                    <Button
                      type="button"
                      onClick={addLine}
                      className="bg-indigo-600 w-full"
                    >
                      + Add Line
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
