
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FaFileInvoiceDollar,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaEllipsisV,
} from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import NotFoundImage from "/assets/scopefinding.png";
import AddPurchaseCreditMemoDrawer from "./AddPurchaseCreditMemoDrawer";
import UpdatePurchaseCreditMemoDrawer from "./UpdatePurchaseCreditMemoDrawer";
import { MdOutlinePostAdd } from "react-icons/md";

export default function PurchaseCreditMemo() {
  const [creditMemos, setCreditMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMemo, setExpandedMemo] = useState(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);

  const fetchCreditMemos = () => {
    fetch("https://0e05b3ea37cd.ngrok-free.app/api/values/GetPurchaseCreditMemos", {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        setCreditMemos(data.Data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCreditMemos();
  }, []);

  const confirmAndPostCreditMemo = (memoId) => {

    console.log(memoId);
    
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to post this credit memo?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, post it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handlePostCreditMemo(memoId);
      }
    });
  };

  
  const handlePostCreditMemo = async (memoId) => {

    try {
      const response = await fetch(
        `https://0e05b3ea37cd.ngrok-free.app/api/values/PostPurchaseCreditMemo/${memoId}`,
        { method: "POST", headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" } }
      );

      const resData = await response.json();
      console.assert.log(resData);
      if (response.ok && resData.Success) {
        Swal.fire("Success!", resData.Message, "success");
        fetchCreditMemos();
      } else {
        Swal.fire("Error!", resData.Message || "Failed to post credit memo.", "error");
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to post credit memo.", "error");
    }
  };

  return (
    <div className="bg-white m-8 px-8 py-8 shadow-2xl rounded-lg relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaFileInvoiceDollar /> Purchase Credit Memos
        </h2>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
          onClick={() => setShowAddDrawer(true)}
        >
          <FaPlus /> Add Credit Memo
        </Button>
      </div>

      {/* Table Header */}
      <div className="bg-gray-200 p-4 rounded-sm">
        <div className="grid grid-cols-12 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
          <span className="col-span-1">No</span>
          <span className="col-span-2">Vendor</span>
          <span className="col-span-2">Address</span>
          <span className="col-span-2">Document Date</span>
          <span className="col-span-2">Due Date</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        {loading ? (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 bg-gray-50 p-6 rounded">
                {Array.from({ length: 12 }).map((__, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        ) : creditMemos.length > 0 ? (
          <div className="space-y-2">
            {creditMemos.map((memo,index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg border">
                <div className="grid grid-cols-12 gap-2 items-center py-4 px-6 hover:shadow-xl transition-all">
                  <span className="font-medium text-indigo-700 col-span-1">{memo.No || index + 1}</span>
                  <span className="col-span-2">{memo.VendorName || `Vendor ${memo.VendorNo}`}</span>
                  <span className="col-span-2">{memo.VendorAddress}</span>
                  <span className="col-span-2">{new Date(memo.DocumentDate).toLocaleDateString()}</span>
                  <span className="col-span-2">{new Date(memo.DueDate).toLocaleDateString()}</span>
                  <span
                    className={`text-sm rounded-2xl text-center flex items-center justify-center px-3 py-1 col-span-1 ${
                      memo.ApprovalStatus === "Approved" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                    }`}
                  >
                    {memo.ApprovalStatus || "Pending"}
                  </span>

                  <div className="col-span-2 flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gray-700 hover:bg-gray-600 hover:text-white text-white"
                      onClick={() => setExpandedMemo(expandedMemo === index ? null : index)}
                    >
                      {expandedMemo === index ? <><FaChevronUp /> Hide Lines</> : <><FaChevronDown /> View Lines</>}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <FaEllipsisV className="h-4 w-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          className=" hover:text-indigo-600"
                          onClick={() => {
                            setSelectedMemo(memo);
                            setShowUpdateDrawer(true);
                          }}
                        >
                          ✏️ Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className=" hover:text-red-600 text-indigo-600"
                          onClick={() => confirmAndPostCreditMemo(memo.Id)}
                        >
                          <MdOutlinePostAdd className="mr-2"/> Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {expandedMemo === index && (
                  <div className="border-t bg-gray-200 p-3 rounded-b-lg">
                    {memo.PurchaseCreditMemoLines?.length > 0 ? (
                      <div className="divide-y">
                        {memo.PurchaseCreditMemoLines.map((line, idx) => (
                          <div key={idx} className="grid grid-cols-6 gap-2 items-center px-6 py-3 mb-2 bg-white rounded-lg border-2 border-gray-400">
                            <span className="col-span-1 font-semibold text-indigo-700">{line.TypeDescription || "Line"}</span>
                            <span className="col-span-2 text-gray-700">{line.Description}</span>
                            <span className="col-span-1 text-gray-600">Qty: {line.Quantity}</span>
                            <span className="col-span-2 text-right font-bold text-green-700">{Number(line.TotalAmount || 0).toLocaleString()} /=</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic px-6 py-3">No credit memo lines found.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-4">
            <img src={NotFoundImage} alt="Not Found" className="mx-auto w-42 h-auto" />
            <p className="font-medium text-gray-400">No Credit Memos Found.</p>
          </div>
        )}
      </div>

      {/* Add & Update Drawers*/}
      <AddPurchaseCreditMemoDrawer open={showAddDrawer} onClose={() => setShowAddDrawer(false)} onSuccess={fetchCreditMemos} />
      <UpdatePurchaseCreditMemoDrawer open={showUpdateDrawer} onClose={() => setShowUpdateDrawer(false)} creditMemo={selectedMemo} onSuccess={fetchCreditMemos} />
       
    </div>
  );
}
