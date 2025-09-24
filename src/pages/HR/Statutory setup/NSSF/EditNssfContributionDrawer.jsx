import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

export default function EditNssfContributionDrawer({ open, onClose, onSuccess, contribution }) {
  const [formData, setFormData] = useState({
    Id: "",
    EmployeeAmount: "",
    EmployerAmount: "",
    Total: "",
  });
  const [loading, setLoading] = useState(false);

  // Prefill
  useEffect(() => {
    if (contribution) {
      setFormData({
        Id: contribution.Id,
        EmployeeAmount: contribution.EmployeeAmount,
        EmployerAmount: contribution.EmployerAmount,
        Total: contribution.Total,
      });
    }
  }, [contribution]);

  const calculateTotal = (emp, er) => {
    const total = (parseFloat(emp) || 0) + (parseFloat(er) || 0);
    setFormData((prev) => ({ ...prev, EmployeeAmount: emp, EmployerAmount: er, Total: total.toFixed(2) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `https://b6d41abe4044.ngrok-free.app/api/nssf-contributions/${formData.Id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update contribution");

      Swal.fire("Success", "NSSF Contribution updated!", "success");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update contribution.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && contribution && (
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
              <h2 className="font-bold text-lg text-white">Edit NSSF Contribution</h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>

            <div className="p-3 flex-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Employee Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.EmployeeAmount}
                    onChange={(e) =>
                      calculateTotal(e.target.value, formData.EmployerAmount)
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Employer Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.EmployerAmount}
                    onChange={(e) =>
                      calculateTotal(formData.EmployeeAmount, e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Total</Label>
                  <Input value={formData.Total} readOnly />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Updating..." : "Update Contribution"}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
