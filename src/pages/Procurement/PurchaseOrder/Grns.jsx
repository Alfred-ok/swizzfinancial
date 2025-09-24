



import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FaBoxes,
  FaPlus,
  FaCalendarAlt,
  FaUser,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import Swal from "sweetalert2";
import NotFoundImage from "/assets/scopefinding.png";

export default function Grns() {
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGrns = () => {
    fetch(`${import.meta.env.VITE_APP_PRO_URL}/api/grns`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        setGrns(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchGrns();
  }, []);

  return (
    <div className="bg-white py-8 rounded-lg">
      

      {/* Table */}
      <div className="bg-gray-200 p-4 rounded-sm">
        <div className="grid grid-cols-7 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
          <span className="col-span-1">GRN Number</span>
          <span className="col-span-1">PO Number</span>
          <span className="col-span-2">Received Date</span>
          <span>Status</span>
          <span>Total Amount</span>
          <span>Received By</span>
        </div>

        {loading ? (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-7 gap-4 bg-gray-50 p-6 rounded"
              >
                {Array.from({ length: 7 }).map((__, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        ) : grns.length > 0 ? (
          <div className="space-y-2">
            {grns.map((grn) => (
              <div
                key={grn.GRNId}
                className="grid grid-cols-7 gap-4 items-center bg-white py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all border"
              >
                <span className="font-medium text-indigo-700 col-span-1">
                  {grn.GRNNumber}
                </span>
                <span className="col-span-1" >{grn.PONumber}</span>
                <span className="flex items-center gap-2 col-span-2">
                  <FaCalendarAlt className="text-gray-500" />{" "}
                  {new Date(grn.ReceivedDate).toLocaleString()}
                </span>
                <span
                  className={`text-sm w-24 rounded-2xl text-center flex items-start justify-center p-1 ${
                    grn.Status === "Received"
                      ? "text-white bg-green-600"
                      : "text-white bg-red-600"
                  }`}
                >
                  {grn.Status}
                </span>
                <span>KES {grn.TotalAmount.toFixed(2)}</span>
                <span className="flex items-center gap-2">
                  <FaUser className="text-gray-500" />{" "}
                  {grn.ReceivedByFirstName || "N/A"}
                </span>
                
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-4">
            <img src={NotFoundImage} alt="Not Found" className="mx-auto w-42 h-auto" />
            <p className="font-medium text-gray-400">No Goods Received Notes found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

