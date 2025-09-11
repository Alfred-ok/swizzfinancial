"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AccountDrawer({ account, open, onClose }) {
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions based on selected account
  useEffect(() => {
    if (!account?.Id) return;

    fetch(
      `${import.meta.env.VITE_APP_BASE_URL}/api/values/GeneralLedgerTransactions?chartOfAccountId=${account.Id}`,
      { headers: { "ngrok-skip-browser-warning": "true" } }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.PageCollection) setTransactions(data.PageCollection);
      })
      .catch((err) => console.error(err));
  }, [account]);

  // Calculate totals
  const totalDebit = transactions.reduce((sum, t) => sum + t.Debit, 0);
  const totalCredit = transactions.reduce((sum, t) => sum + t.Credit, 0);

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
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-180 bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="font-bold text-lg">
                {account?.Description || "Account Details"}
              </h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* 🔹 Compact Account Overview Card */}
              {account && (
                <Card className="rounded-2xl shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Account Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-8 text-sm items-start">
                    {/* Left: Balance */}
                    <div className="bg-gradient-to-r from-indigo-800 to-indigo-700 rounded-2xl p-4 pb-10">
                      <p className="text-xs opacity-80">Balance</p>
                      <p className="text-3xl font-bold">
                        {account.Balance.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </p>
                    </div>

                    {/* Right: Other Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs border-t-2 border-b-2 p-4 rounded-2xl border-indigo-400">
                      <div>
                        <p className="opacity-80">Debit</p>
                        <p className="font-semibold text-sm">
                          {totalDebit.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="opacity-80">Credit</p>
                        <p className="font-semibold text-sm">
                          {totalCredit.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="opacity-80">Code</p>
                        <p className="font-medium">{account.Code}</p>
                      </div>
                      <div>
                        <p className="opacity-80">Type</p>
                        <p className="font-medium">{account.TypeDescription}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="opacity-80">Created</p>
                        <p className="font-medium">
                          {new Date(account.CreatedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transactions Table */}
              <div className="mt-4 ">
                <h3 className="font-semibold mb-2">Transactions</h3>
                <Table className="text-center bg-indigo-700">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center text-gray-50">Date</TableHead>
                      <TableHead className="text-center text-gray-50">Debit</TableHead>
                      <TableHead className="text-center text-gray-50">Credit</TableHead>
                      <TableHead className="text-center text-gray-50">Balance</TableHead>
                      <TableHead className="text-center text-gray-50">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length > 0 ? (
                      transactions.map((tx, i) => (
                        <TableRow
                          key={tx.Id}
                          className={i % 2 === 0 ? "bg-indigo-100" : "bg-white"}
                        >
                          <TableCell>
                            {new Date(
                              tx.JournalValueDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{tx.Debit.toLocaleString()}</TableCell>
                          <TableCell>{tx.Credit.toLocaleString()}</TableCell>
                          <TableCell>
                            {tx.RunningBalance.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {tx.JournalPrimaryDescription}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-2 text-gray-500 bg-gray-100"
                        >
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
