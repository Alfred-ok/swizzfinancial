import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FaChevronDown,
  FaChevronUp,
  FaBuilding,
} from "react-icons/fa";
import NotFoundImage from "/assets/scopefinding.png";

export default function FullyReceived() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchPurchaseOrders = () => {
    fetch(
      `${import.meta.env.VITE_APP_PRO_URL}/api/purchaseorders/status/Fully Received`,
      { headers: { "ngrok-skip-browser-warning": "true" } }
    )
      .then((res) => res.json())
      .then((data) => {
        setPurchaseOrders(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  console.log(purchaseOrders);

  console.log()
  return (
    <div className="bg-white py-8 rounded-lg">
      <div className="bg-gray-200 p-4 rounded-sm">
        {/* Table Headers */}
        <div className="grid grid-cols-6 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
          <span className="col-span-1">PO Number</span>
          <span className="col-span-1">Supplier</span>
          <span className="col-span-1">Order Date</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-1">Total</span>
          <span className="text-right col-span-1 mr-4">Actions</span>
        </div>

        {loading ? (
          // Skeleton Loader
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 bg-gray-50 py-4 px-6 rounded">
                {Array.from({ length: 6 }).map((__, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        ) : purchaseOrders.length > 0 ? (
          // Data Rows
          <div className="space-y-2">
            {purchaseOrders.map((po) => (
              <div key={po.PurchaseOrderId} className="bg-white rounded-lg shadow-lg border">
                {/* Row */}
                <div className="grid grid-cols-6 gap-2 items-center py-4 px-6 hover:shadow-xl transition-all">
                  <span className="font-medium text-indigo-700 col-span-1">{po.PONumber}</span>
                  <span className="flex items-center gap-2 col-span-1">
                    <FaBuilding className="text-gray-500" /> {po.SupplierName}
                  </span>
                  <span className="col-span-1">{new Date(po.OrderDate).toLocaleDateString()}</span>
                  <span className="text-sm w-28 rounded-2xl col-span-1 text-center flex items-center justify-center p-1 bg-green-600 text-white">
                    {po.Status}
                  </span>
                  <span className="font-semibold col-span-1">
                    {po.Currency} {po.TotalAmount.toLocaleString()}
                  </span>
                  <div className="flex gap-2 col-span-1 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gray-700 text-white hover:bg-gray-600 hover:text-white"
                      onClick={() =>
                        setExpandedRow(expandedRow === po.PurchaseOrderId ? null : po.PurchaseOrderId)
                      }
                    >
                      {expandedRow === po.PurchaseOrderId ? (
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
                {expandedRow === po.PurchaseOrderId && (
                  <div className="bg-gray-100 px-6 py-4 border-t">
                    <h4 className="font-semibold mb-2">Line Items</h4>
                    <div className="bg-gray-300 p-2 rounded-lg">
                      <div className="grid grid-cols-5 gap-4 font-semibold bg-gray-700 text-white py-2 px-4 rounded">
                        <span>Line</span>
                        <span>Description</span>
                        <span>Qty</span>
                        <span>Unit Price</span>
                        <span>Total</span>
                      </div>
                      {po.Lines.map((line, i) => (
                        <div key={i} className="grid grid-cols-5 gap-4 py-2 px-4 border-b-2 border-gray-50 last:border-0">
                          <span>{line.LineNumber}</span>
                          <span>{line.ItemDescription}</span>
                          <span>{line.QuantityOrdered}</span>
                          <span>{po.Currency} {line.UnitPrice}</span>
                          <span className="font-medium">
                            {po.Currency} {(line.QuantityOrdered * line.UnitPrice).toLocaleString()}
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
          // Empty State
          <div className="text-gray-500 text-center mt-4">
            <img src={NotFoundImage} alt="Not Found" className="mx-auto w-42 h-auto" />
            <p className="font-medium text-gray-400">No Fully Received Purchase Orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
