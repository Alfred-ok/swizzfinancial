import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FaUser,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import NotFoundImage from "/assets/scopefinding.png";

export default function Pending() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [submitting, setSubmitting] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Fetch pending requisitions
  const fetchRequisitions = () => {
    fetch(
      `${import.meta.env.VITE_APP_PRO_URL}/api/storerequisition/status?status=Pending`,
      { headers: { "ngrok-skip-browser-warning": "true" } }
    )
      .then((res) => res.json())
      .then((data) => {
        setRequisitions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequisitions();
  }, []);

  // Approve / Reject action
  const handleAction = async (id, status) => {
    const confirm = await Swal.fire({
      title: `${status} Requisition?`,
      text: `Do you want to mark this requisition as ${status}?`,
      icon: status === "Approve" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: status === "Approve" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (!confirm.isConfirmed) return;

    setSubmitting(id);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_PRO_URL}/api/storerequisition/${id}/updateStatus?status=${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (res.ok) {
        Swal.fire("Success!", `Requisition ${status.toLowerCase()} successfully.`, "success");
        fetchRequisitions();
      } else {
        Swal.fire("Error!", `Failed to ${status.toLowerCase()} requisition.`, "error");
      }
    } catch (err) {
      Swal.fire("Error!", "Something went wrong.", "error");
    } finally {
      setSubmitting(null);
      setDropdownOpen(null);
    }
  };

  return (
    <div className="bg-white py-8 rounded-lg">
      {/* Table Header */}
      <div className="bg-gray-200 p-4 rounded-sm">
        <div className="grid grid-cols-7 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
          <span>Number</span>
          <span>Requester</span>
          <span>Department</span>
          <span>Status</span>
          <span>Total</span>
          <span className="text-right col-span-2">Actions</span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-6 gap-2 bg-gray-50 py-4 px-6 rounded"
              >
                {Array.from({ length: 6 }).map((__, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        ) : requisitions.length > 0 ? (
          <div className="space-y-2">
            {requisitions.map((req) => {
              // compute total
              const totalAmount = req.Lines?.reduce(
                (sum, l) => sum + (l.QuantityRequested || 0) * (l.UnitPrice || 0),
                0
              );

              return (
                <div
                  key={req.StoreRequisitionID}
                  className="bg-white rounded-lg shadow-lg border relative"
                >
                  {/* Row */}
                  <div className="grid grid-cols-9 gap-2 items-center py-4 px-6 hover:shadow-xl transition-all">
                    <span className="font-medium text-indigo-700 col-span-2 truncate">
                      {req.RequisitionNumber}
                    </span>
                    <span className="flex items-center gap-2 col-span-1">
                      <FaUser className="text-gray-500" /> {req.RequesterName}
                    </span>
                    <span className="flex items-center gap-2 col-span-1">
                      <FaBuilding className="text-gray-500" /> {req.DepartmentName}
                    </span>
                    <span className="col-span-2 text-sm w-40 rounded-2xl text-center flex items-center justify-center p-1 bg-yellow-500 text-white">
                      {req.Status}
                    </span>
                    <span className="font-semibold">Ksh {totalAmount.toFixed(2)}</span>

                    <div className="flex gap-2 justify-end col-span-2 relative">
                      {/* Action Dropdown */}
                      <div className="relative">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          onClick={() =>
                            setDropdownOpen(
                              dropdownOpen === req.StoreRequisitionID
                                ? null
                                : req.StoreRequisitionID
                            )
                          }
                          disabled={submitting === req.StoreRequisitionID}
                        >
                          <FaChevronDown />{" "}
                          {submitting === req.StoreRequisitionID
                            ? "Processing..."
                            : "Take Action"}
                        </Button>

                        {dropdownOpen === req.StoreRequisitionID && (
                          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                            <button
                              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-green-100 text-green-700"
                              onClick={() => handleAction(req.StoreRequisitionID, "Approve")}
                            >
                              <FaCheckCircle /> Approve
                            </button>
                            <button
                              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-100 text-red-700"
                              onClick={() => handleAction(req.StoreRequisitionID, "Rejected")}
                            >
                              <FaTimesCircle /> Reject
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Expand items */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-700 text-white hover:bg-gray-600 hover:text-white col-span-1"
                        onClick={() =>
                          setExpandedRow(
                            expandedRow === req.StoreRequisitionID
                              ? null
                              : req.StoreRequisitionID
                          )
                        }
                      >
                        {expandedRow === req.StoreRequisitionID ? (
                          <>
                            <FaChevronUp /> Hide Items
                          </>
                        ) : (
                          <>
                            <FaChevronDown /> Show Items
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Lines */}
                  {expandedRow === req.StoreRequisitionID && (
                    <div className="bg-gray-100 px-6 py-4 border-t">
                      <h4 className="font-semibold mb-2">Line Items</h4>
                      <div className="bg-gray-300 p-2 rounded-lg">
                        <div className="grid grid-cols-5 gap-4 font-semibold bg-gray-700 text-white py-2 px-4 rounded">
                          <span>Description</span>
                          <span>Qty</span>
                          <span>Unit Price</span>
                          <span>Remarks</span>
                          <span>Total</span>
                        </div>
                        {req.Lines.map((line) => (
                          <div
                            key={line.LineID}
                            className="grid grid-cols-5 gap-4 py-2 px-4 border-b-2 border-gray-50 last:border-0"
                          >
                            <span>{line.ItemDescription}</span>
                            <span>{line.QuantityRequested}</span>
                            <span>Ksh {line.UnitPrice}</span>
                            <span>{line.Remarks}</span>
                            <span className="font-medium">
                              Ksh {(line.QuantityRequested * line.UnitPrice).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-4">
            <img src={NotFoundImage} alt="Not Found" className="mx-auto w-42 h-auto" />
            <p className="font-medium text-gray-400">No Requisitions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
