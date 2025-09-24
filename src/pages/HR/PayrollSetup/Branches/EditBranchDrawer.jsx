
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function EditBranchDrawer({ open, onClose, onSuccess, branch }) {
  const [formData, setFormData] = useState({
    Code: "",
    BranchName: "",
    BranchNumber: "",
    BankCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);

  // Load banks for dropdown
  useEffect(() => {
    fetch("https://b6d41abe4044.ngrok-free.app/api/employee-banks", {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        setBanks(data.data || []);
      })
      .catch((err) => console.error("Failed to fetch banks:", err));
  }, []);

  // Prefill form when editing
  useEffect(() => {
    if (branch) {
      setFormData({
        Code: branch.Code,
        BranchName: branch.BranchName,
        BranchNumber: branch.BranchNumber,
        BankCode: branch.BankCode,
      });
    }
  }, [branch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `https://b6d41abe4044.ngrok-free.app/api/employee-branches/${branch.Code}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update branch");

      Swal.fire("Success", "Branch updated successfully!", "success");

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update branch.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && branch && (
        <>
          <motion.div
            className="fixed inset-0 bg-black z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-5 right-5 w-[480px] bg-white shadow-xl z-50 flex flex-col rounded-2xl p-3"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-4 flex justify-between items-center bg-blue-600 rounded-2xl m-2">
              <h2 className="font-bold text-lg text-white">Edit Branch</h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>

            <div className="p-3 flex-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Branch Name</Label>
                  <Input
                    value={formData.BranchName}
                    onChange={(e) =>
                      setFormData({ ...formData, BranchName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Branch Number</Label>
                  <Input
                    value={formData.BranchNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, BranchNumber: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Bank</Label>
                  <Select
                    value={formData.BankCode}
                    onValueChange={(val) =>
                      setFormData({ ...formData, BankCode: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {banks.map((bank) => (
                        <SelectItem key={bank.Code} value={bank.BankCode}>
                          {bank.Name} ({bank.BankCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Updating..." : "Update Branch"}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
