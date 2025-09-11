

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2"; // ✅ import swal2

export default function AddAccountDrawer({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    parentId: "",
    accountType: "",
    accountCategory: "",
    accountCode: "",
    accountName: "",
    depth: "1",
  });

  const [loading, setLoading] = useState(false);
  const [parentOptions, setParentOptions] = useState([]);

  const accountTypes = [
    { value: "1000", label: "Assets" },
    { value: "2000", label: "Liabilities" },
    { value: "3000", label: "Equity" },
    { value: "4000", label: "Revenue" },
    { value: "5000", label: "Expenses" },
  ];

  const accountCategories = [
    { value: "4096", label: "Header Account (Non-Postable)" },
    { value: "4097", label: "Detail Account (Postable)" },
  ];

  // ✅ Fetch parent accounts for dropdown
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}/api/values/GetChartOfAccount`,
          {
            headers: { "ngrok-skip-browser-warning": "true" },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch accounts");
        const data = await res.json();
        if (data?.Success) {
          setParentOptions(
            data.Data.map((acc) => ({
              value: acc.Id,
              label: acc.AccountName,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (open) fetchParents();
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/values/chartofaccount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Failed to create account");

      const data = await res.json();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Account created successfully!",
        confirmButtonColor: "#2563eb",
      });

      setForm({
        parentId: "",
        accountType: "",
        accountCategory: "",
        accountCode: "",
        accountName: "",
        depth: "1",
      });

      if (onSuccess) onSuccess(data);
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to create account. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

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
            className="fixed top-0 right-0 h-full w-140 bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b ">
              <h2 className="font-bold text-lg">Create Chart of Account</h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1 bg-indigo-400">
              <Card className="rounded-xl border bg-transparent border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-md bg-indigo-800 text-white p-4 rounded-xl">
                    Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Account Name */}
                    <div>
                      <Label htmlFor="accountName" className="text-white">
                        Account Name
                      </Label>
                      <Input
                        id="accountName"
                        name="accountName"
                        value={form.accountName}
                        onChange={handleChange}
                        placeholder="Fixed Assets"
                        className="bg-white"
                        required
                      />
                    </div>

                    {/* Account Code */}
                    <div>
                      <Label htmlFor="accountCode" className="text-white">
                        Account Code
                      </Label>
                      <Input
                        id="accountCode"
                        name="accountCode"
                        value={form.accountCode}
                        onChange={handleChange}
                        placeholder="1067"
                        className="bg-white"
                        required
                      />
                    </div>

                    {/* Account Type */}
                    <div>
                      <Label className="text-white">Account Type</Label>
                      <Select
                        value={form.accountType}
                        onValueChange={(val) =>
                          handleSelectChange("accountType", val)
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Account Category */}
                    <div>
                      <Label className="text-white">Account Category</Label>
                      <Select
                        value={form.accountCategory}
                        onValueChange={(val) =>
                          handleSelectChange("accountCategory", val)
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountCategories.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* ✅ Parent ID Dropdown */}
                    <div>
                      <Label className="text-white">Parent Account</Label>
                      <Select
                        value={form.parentId}
                        onValueChange={(val) =>
                          handleSelectChange("parentId", val)
                        }
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select parent (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {parentOptions.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Depth */}
                    <div>
                      <Label htmlFor="depth" className="text-white">
                        Depth
                      </Label>
                      <Input
                        id="depth"
                        name="depth"
                        value={form.depth}
                        onChange={handleChange}
                        placeholder="1"
                        className="bg-white"
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full bg-indigo-800"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
