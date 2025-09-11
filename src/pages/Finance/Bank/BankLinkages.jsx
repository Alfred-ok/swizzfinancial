// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { FaUniversity, FaPlus, FaHashtag, FaDollarSign } from "react-icons/fa";
// import AddBankWithLinkagesDrawer from "./AddBankWithLinkagesDrawer";

// export default function BankLinkages() {
//   const [linkages, setLinkages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const fetchLinkages = () => {
//     fetch("https://01b8e0a81b7e.ngrok-free.app/api/values/getBankLinkages", {
//       headers: { "ngrok-skip-browser-warning": "true" },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setLinkages(data.Data || []);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   };

//   useEffect(() => {
//     fetchLinkages();
//   }, []);

//   return (
//     <div className="bg-white m-8 px-8 py-4 rounded-lg">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
//         <h2 className="text-xl font-bold text-white flex items-center gap-2">
//           <FaUniversity className="text-white" /> Bank
//         </h2>
//         <Button
//           onClick={() => setDrawerOpen(true)}
//           className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
//         >
//           <FaPlus /> Add Bank
//         </Button>
//       </div>

//       {/* List */}
//       <div className="space-y-4">
//         {loading ? (
//           Array.from({ length: 3 }).map((_, i) => (
//             <Card key={i} className="p-4 animate-pulse">
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//             </Card>
//           ))
//         ) : linkages.length > 0 ? (
//           linkages.map((link) => (
//             <Card
//               key={link.Id}
//               className="hover:shadow-lg transition-all cursor-pointer"
//             >
//               <CardContent className="flex items-center justify-between gap-6 py-4 px-4">
//                 {/* Bank Name & Branch */}
//                 <div className="flex-1 rounded-lg p-3 ">
//                   <p className="font-bold text-indigo-700 flex items-center gap-2">
//                     <FaUniversity className="text-indigo-700" /> {link.BankName}
//                   </p>
//                   <p className="text-sm text-gray-600">{link.BankBranchName}</p>
//                 </div>

//                 {/* Account Number */}
//                 <div className="w-48 text-sm text-gray-700">
//                   <p className="font-medium flex items-center gap-2">
//                     <FaHashtag className="text-gray-500" /> {link.BankAccountNumber}
//                   </p>
//                   <p className="text-xs text-gray-500">{link.Remarks}</p>
//                 </div>

//                 {/* Balance */}
//                 <div className="w-40 text-right  bg-gray-100 rounded-lg p-3">
//                   <p
//                     className={`font-semibold flex items-center justify-end gap-1 ${
//                       link.BankLinkageBalance >= 0
//                         ? "text-green-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     <FaDollarSign />
//                     {link.BankLinkageBalance.toLocaleString()}
//                   </p>
//                   <p className="text-xs text-gray-500">Balance</p>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         ) : (
//           <p className="text-gray-500 text-center">
//             No bank linkages found.
//           </p>
//         )}
//       </div>

//       {/* Drawer */}
//       <AddBankWithLinkagesDrawer
//         open={drawerOpen}
//         onClose={() => {
//           setDrawerOpen(false);
//           fetchLinkages(); // refresh after adding
//         }}
//       />
//     </div>
//   );
// }















import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUniversity, FaPlus, FaHashtag, FaDollarSign } from "react-icons/fa";
import AddBankWithLinkagesDrawer from "./AddBankWithLinkagesDrawer";

export default function BankLinkages() {
  const [linkages, setLinkages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchLinkages = () => {
    fetch("https://01b8e0a81b7e.ngrok-free.app/api/values/getBankLinkages", {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        setLinkages(data.Data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLinkages();
  }, []);

  return (
    <div className="bg-white m-8 px-8 py-8 shadow-2xl rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaUniversity className="text-white" /> Bank
        </h2>
        <Button
          onClick={() => setDrawerOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaPlus /> Add Bank
        </Button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
        <span>Bank Name</span>
        <span>Branch</span>
        <span>Account Number</span>
        <span>Remarks</span>
        <span className="text-right">Balance</span>
      </div>

      {/* Table Body */}
      {loading ? (
        <div className="space-y-2 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 bg-gray-50 p-3 rounded">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded text-right"></div>
            </div>
          ))}
        </div>
      ) : linkages.length > 0 ? (
        <div className="space-y-2">
          {linkages.map((link) => (
            <div
              key={link.Id}
              className="grid grid-cols-5 gap-4 items-center bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2"
            >
              <span className="flex items-center gap-2 font-medium text-indigo-700">
                {link.BankName}
              </span>
              <span>{link.BankBranchName}</span>
              <span className="flex items-center gap-1">
                <FaHashtag className="text-gray-500" /> {link.BankAccountNumber}
              </span>
              <span>{link.Remarks}</span>
              <span
                className={`text-right font-semibold bg-gray-100 rounded-lg py-2 px-4 ${
                  link.BankLinkageBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                <FaDollarSign className="inline" /> {link.BankLinkageBalance.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">No bank linkages found.</p>
      )}

      {/* Drawer */}
      <AddBankWithLinkagesDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          fetchLinkages(); // refresh after adding
        }}
      />
    </div>
  );
}
