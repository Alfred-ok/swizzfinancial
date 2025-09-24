
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MdPayments } from "react-icons/md";

import Banks from "./Banks/Banks";
import Branches from "./Branches/Branches";
import InsuranceCompanies from "./Insurances/InsuranceCompanies";

export default function PayrollSetup() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [totals, setTotals] = useState({
    banks: 0,
    branches: 0,
    insurance: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch totals from APIs
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [banksRes, branchesRes, insuranceRes] = await Promise.all([
          fetch("https://b6d41abe4044.ngrok-free.app/api/employee-banks", {
            headers: { "ngrok-skip-browser-warning": "true" },
          }),
          fetch("https://b6d41abe4044.ngrok-free.app/api/employee-branches", {
            headers: { "ngrok-skip-browser-warning": "true" },
          }),
          fetch("https://b6d41abe4044.ngrok-free.app/api/employee-insurance-companies", {
            headers: { "ngrok-skip-browser-warning": "true" },
          }),
        ]);

        const banksData = await banksRes.json();
        const branchesData = await branchesRes.json();
        const insuranceData = await insuranceRes.json();

        setTotals({
          banks: banksData?.data?.length || 0,
          branches: branchesData?.data?.length || 0,
          insurance: insuranceData?.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching totals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  const users = [
    { id: 1, name: "Banks", total: totals.banks, subtitle: "Financial Institution Bank" },
    { id: 2, name: "Branches", total: totals.branches, subtitle: "Financial Institution Branches" },
    { id: 3, name: "Insurance", total: totals.insurance, subtitle: "Insurance Companies" },
  ];

  const user = selectedUser || users[0];

  const renderContent = () => {
    switch (user.name) {
      case "Banks":
        return <Banks />;
      case "Branches":
        return <Branches />;
      case "Insurance":
        return <InsuranceCompanies />;
      default:
        return <p>Select an option from the sidebar</p>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* LEFT SIDEBAR */}
      <aside className="w-88 border-r bg-white p-4 flex flex-col">
        <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MdPayments className="text-white" /> Payroll Setup
          </h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2 p-2 bg-gray-200 rounded-xl">
            {users.map((u) => (
              <Card
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className={`p-3 cursor-pointer ${user.id === u.id ? "bg-indigo-800 text-white" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">{u.name}</p>
                  <Badge className={`bg-gray-200 hover:bg-gray-200 text-gray-900 ${user.id === u.id ? "bg-indigo-600 hover:bg-indigo-600 text-white" : ""}`}>
                    Total {loading ? "..." : u.total}
                  </Badge>
                </div>
                <p className={`text-xs ${user.id === u.id ? "text-white" : "text-muted-foreground"}`}>
                  {u.subtitle}
                </p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
