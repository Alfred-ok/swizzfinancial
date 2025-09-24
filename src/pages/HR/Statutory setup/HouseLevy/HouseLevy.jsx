





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
import { FaEdit, FaHome, FaPlus, FaTrash } from "react-icons/fa";
import NotFoundImage from "/assets/scopefinding.png";
import AddHouseLevyDrawer from "./AddHouseLevyDrawer"; // <-- import drawer
import UpdateHouseLevyDrawer from "./UpdateHouseLevyDrawer"; // NEW

export default function HousingLevy() {
  const [levies, setLevies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false); // <-- control drawer
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [selectedLevy, setSelectedLevy] = useState(null);

  // Filters
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);


  // Delete contribution
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the contribution.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `https://b6d41abe4044.ngrok-free.app/api/housing-levy-contributions/${id}`,
        {
          method: "DELETE",
          headers: { "ngrok-skip-browser-warning": "true" },
        }
      );

      if (!res.ok) throw new Error("Failed to delete levy");

      Swal.fire("Deleted!", "Levy contribution deleted.", "success");
      fetchLevies();
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    }
  };

  // Fetch housing levies
  const fetchLevies = () => {
    setLoading(true);
    fetch("https://b6d41abe4044.ngrok-free.app/api/housing-levy-contributions", {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        setLevies(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLevies();
  }, []);

  // Filter + paginate
  const filteredLevies = useMemo(() => {
    return levies.filter(
      (l) =>
        l.Id.toString().includes(search) ||
        l.EmployeeAmount.toString().includes(search) ||
        l.EmployerAmount.toString().includes(search) ||
        l.Total.toString().includes(search)
    );
  }, [levies, search]);

  const paginatedLevies = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLevies.slice(start, start + pageSize);
  }, [filteredLevies, page, pageSize]);

  const totalPages = Math.ceil(filteredLevies.length / pageSize);

  return (
    <div className="bg-white px-4 py-4 rounded-lg relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-indigo-700 px-6 py-3 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaHome className="text-white" /> Housing Levy Contributions
        </h2>
        <Button
          onClick={() => setDrawerOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-2"
        >
          <FaPlus /> Add Levy
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-4 justify-between">
        <Input
          placeholder="Search by amount..."
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
        <div className="grid grid-cols-4 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
          <span>ID</span>
          <span>Employee Amount</span>
          <span>Employer Amount</span>
          <span>Total</span>
        </div>

        {loading ? (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-4 bg-gray-50 p-6 rounded"
              >
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : paginatedLevies.length > 0 ? (
          <div className="space-y-2">
            {paginatedLevies.map((l) => (
              <div
                key={l.Id}
                className="grid grid-cols-5 gap-4 items-center bg-white py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all border"
              >
                <span className="font-medium text-green-700">{l.Id}</span>
                <span>{l.EmployeeAmount}</span>
                <span>{l.EmployerAmount}</span>
                <span>{l.Total}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1"
                    onClick={() => {
                      setSelectedLevy(l);
                      setUpdateDrawerOpen(true);
                    }}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
                    onClick={() => handleDelete(l.Id)}
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
            <p className="font-medium text-gray-400">No housing levy records found.</p>
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

      {/* Drawer for adding levy */}
      <AddHouseLevyDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => {
          setDrawerOpen(false);
          fetchLevies(); // refresh after adding
        }}
      />
      {/* Update Drawer */}
      <UpdateHouseLevyDrawer
        open={updateDrawerOpen}
        onClose={() => setUpdateDrawerOpen(false)}
        levy={selectedLevy}
        onSuccess={() => {
          setUpdateDrawerOpen(false);
          fetchLevies();
        }}
      />
    </div>
  );
}
