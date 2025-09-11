import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaBox, FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import AddInvItemDrawer from "./AddInvItemDrawer";
import EditInvItemDrawer from "./EditInvItemDrawer";
import Swal from "sweetalert2";

export default function Invitem() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [expanded, setExpanded] = useState({}); // toggle details

  const fetchItems = () => {
    fetch(`${import.meta.env.VITE_APP_INV_URL}/api/items`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_APP_INV_URL}/api/items/${id}`,
            {
              method: "DELETE",
              headers: { "ngrok-skip-browser-warning": "true" },
            }
          );
          if (!res.ok) throw new Error("Failed to delete item");
          Swal.fire("Deleted!", "Item has been deleted.", "success");
          fetchItems();
        } catch (err) {
          console.error(err);
          Swal.fire("Error!", "Failed to delete item.", "error");
        }
      }
    });
  };

  return (
    <div className="bg-white m-8 px-8 py-8 shadow-2xl rounded-lg relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-indigo-800 px-6 py-3 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaBox /> Items
        </h2>
        <Button
          onClick={() => setAddDrawerOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
        >
          <FaPlus /> Add Item
        </Button>
      </div>

      {/* Table */}
      <div className="bg-gray-200 p-4 rounded-sm">
        <div className="grid grid-cols-5 gap-4 bg-gray-700 text-gray-100 font-semibold p-3 rounded-lg mb-4">
          <span>Item ID</span>
          <span>Item No</span>
          <span>Description</span>
          <span>Inventory Balance</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.Id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border"
              >
                <div className="grid grid-cols-5 gap-4 items-center py-4 px-6">
                  <span>{item.ItemId}</span>
                  <span>{item.ItemNo}</span>
                  <span className="font-medium text-indigo-700">
                    {item.Description}
                  </span>
                  <span>{item.InventoryBalance}</span>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setEditItem(item);
                        setEditDrawerOpen(true);
                      }}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-white"
                      onClick={() => handleDelete(item.Id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [item.Id]: !prev[item.Id],
                        }))
                      }
                    >
                      {expanded[item.Id] ? <FaChevronUp /> : <FaChevronDown />}
                    </Button>
                  </div>
                </div>

                {/* Expanded details */}
                {expanded[item.Id] && (
                  <div className="px-3 py-3 text-sm bg-gray-200 border-t mt-2">
                    <p className="p-3 border rounded-lg bg-white m-1">
                      <strong>Category:</strong>{" "}
                      {item.CategoryDescription || "N/A"}
                    </p>
                    <p className="p-3 border rounded-lg bg-white m-1">
                      <strong>Unit Of Measure:</strong>{" "}
                      {item.UnitOfMeasureDescription || "N/A"}
                    </p>
                    <p className="p-3 border rounded-lg bg-white m-1">
                      <strong>Location:</strong>{" "}
                      {item.LocationDescription || "N/A"}
                    </p>
                    <p className="p-3 border rounded-lg bg-white m-1"><strong>Costing Method:</strong> {item.CostingMethod}</p>
                    <p className="p-3 border rounded-lg bg-white m-1"><strong>Created By:</strong> {item.CreatedBy}</p>
                    <p className="p-3 border rounded-lg bg-white m-1"><strong>Created Date:</strong> {new Date(item.CreatedDate).toLocaleString()}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">No items found.</p>
        )}
      </div>

      {/* Add Drawer */}
      <AddInvItemDrawer
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        onSuccess={fetchItems}
      />

      {/* Edit Drawer */}
      <EditInvItemDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        onSuccess={fetchItems}
        item={editItem}
      />
    </div>
  );
}
