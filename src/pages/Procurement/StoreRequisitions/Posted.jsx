
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FaUser,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import NotFoundImage from "/assets/scopefinding.png";

export default function Posted() {
  const [storeRequisitions, setStoreRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  // Fetch Rejected Store Requisitions
  const fetchStoreRequisitions = () => {
    fetch(
      `${import.meta.env.VITE_APP_PRO_URL}/api/storerequisition/status?status=Post`,
      { headers: { "ngrok-skip-browser-warning": "true" } }
    )
      .then((res) => res.json())
      .then((data) => {
        setStoreRequisitions(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStoreRequisitions();
  }, []);

  return (
    <div className="bg-white py-8 rounded-lg">
      {/* Table */}
      <div className="bg-gray-200 p-4 rounded-sm">
        <div className="grid grid-cols-12 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
          <span className="col-span-2">Number</span>
          <span className="col-span-2">Requested By</span>
          <span className="col-span-2">Department</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2">Total</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

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
        ) : storeRequisitions.length > 0 ? (
          <div className="space-y-2">
            {storeRequisitions.map((req) => (
              <div
                key={req.StoreRequisitionID}
                className="bg-white rounded-lg shadow-lg border"
              >
                {/* Row */}
                <div className="grid grid-cols-12 gap-2 items-center py-4 px-6 hover:shadow-xl transition-all">
                  <span className="font-medium text-indigo-700 col-span-2">
                    {req.RequisitionNumber}
                  </span>
                  <span className="flex items-center gap-2 col-span-2">
                    <FaUser className="text-gray-500" /> {req.RequesterName}
                  </span>
                  <span className="flex items-center gap-2 col-span-2">
                    <FaBuilding className="text-gray-500" /> {req.DepartmentName}
                  </span>
                  <span className="col-span-2 text-sm w-28 rounded-2xl text-center flex items-center justify-center p-1 bg-indigo-600 text-white">
                    {req.Status}
                  </span>
                  <span className="font-semibold col-span-2">
                    Ksh{" "}
                    {req.Lines.reduce(
                      (sum, l) => sum + l.QuantityRequested * l.UnitPrice,
                      0
                    )}
                  </span>

                  <div className="flex justify-end gap-2 col-span-2">
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
                          <FaChevronDown /> View Items
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Dropdown Lines */}
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
                            Ksh {line.QuantityRequested * line.UnitPrice}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-4">
            <img
              src={NotFoundImage}
              alt="Not Found"
              className="mx-auto w-42 h-auto"
            />
            <p className="font-medium text-gray-400">
              No Rejected Requisitions found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
