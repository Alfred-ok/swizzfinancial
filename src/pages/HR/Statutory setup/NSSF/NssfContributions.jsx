import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FaMoneyBillWave, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import NotFoundImage from "/assets/scopefinding.png";
import AddNssfContributionDrawer from "./AddNssfContributionDrawer";
import EditNssfContributionDrawer from "./EditNssfContributionDrawer";

export default function NssfContributions() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);

  // Filters
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Fetch contributions
  const fetchContributions = () => {
    setLoading(true);
    fetch("https://b6d41abe4044.ngrok-free.app/api/nssf-contributions", {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        setContributions(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  // Delete Handler
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently remove the contribution entry.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `https://b6d41abe4044.ngrok-free.app/api/nssf-contributions/${id}`,
            {
              method: "DELETE",
              headers: { "ngrok-skip-browser-warning": "true" },
            }
          );

          if (!res.ok) throw new Error("Failed to delete contribution");
          Swal.fire("Deleted!", "Contribution has been deleted.", "success");
          fetchContributions();
        } catch (err) {
          Swal.fire("Error!", "Failed to delete contribution.", "error");
        }
      }
    });
  };

  // Filtered and paginated contributions
  const filteredContributions = useMemo(() => {
    return contributions.filter(
      (c) =>
        c.EmployeeAmount.toString().includes(search) ||
        c.EmployerAmount.toString().includes(search) ||
        c.Total.toString().includes(search)
    );
  }, [contributions, search]);

  const paginatedContributions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredContributions.slice(start, start + pageSize);
  }, [filteredContributions, page, pageSize]);

  const totalPages = Math.ceil(filteredContributions.length / pageSize);

  return (
    <div className="bg-white px-4 py-4 rounded-lg relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaMoneyBillWave className="text-white" /> NSSF Contributions
        </h2>
        <Button
          onClick={() => setOpenAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaPlus /> Add Contribution
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-4 justify-between">
        <Input
          placeholder="Search by employee, employer or total..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-1/3"
        />

        <Select
          value={String(pageSize)}
          onValueChange={(val) => {
            setPageSize(Number(val));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-gray-200 p-4 rounded-sm">
        <div className="grid grid-cols-5 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
          <span>ID</span>
          <span>Employee Amount</span>
          <span>Employer Amount</span>
          <span>Total</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-5 gap-4 bg-gray-50 p-6 rounded"
              >
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : paginatedContributions.length > 0 ? (
          <div className="space-y-2">
            {paginatedContributions.map((c) => (
              <div
                key={c.Id}
                className="grid grid-cols-5 gap-4 items-center bg-white py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all border"
              >
                <span className="font-medium text-green-700">{c.Id}</span>
                <span>{c.EmployeeAmount}</span>
                <span>{c.EmployerAmount}</span>
                <span className="font-bold">{c.Total}</span>

                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setSelectedContribution(c);
                      setOpenEdit(true);
                    }}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-white"
                    onClick={() => handleDelete(c.Id)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </div>
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
              No contributions found.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3"
          >
            Prev
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3"
          >
            Next
          </Button>
        </div>
      )}

      {/* Drawers */}
      <AddNssfContributionDrawer
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={fetchContributions}
      />
      <EditNssfContributionDrawer
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSuccess={fetchContributions}
        contribution={selectedContribution}
      />
    </div>
  );
}
