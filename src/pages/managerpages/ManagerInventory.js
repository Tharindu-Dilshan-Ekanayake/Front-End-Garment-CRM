import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import TableCompo from "../../components/TableCompo";
import { useInventoryStore } from "../../store/inventoryStore";
import HeadText from "../../components/HeadText";

export default function ManagerInventory() {
  const {
    inventoryItems,
    loading,
    error,
    searchTerm,
    fetchInventoryItems,
    setSearchTerm,
    selectedInventory,
    detailLoading,
    fetchInventoryItemById,
    clearSelectedInventory,
    updateInventoryItem,
  } = useInventoryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editValues, setEditValues] = useState({
    itemQuantity: "",
  });

  useEffect(() => {
    fetchInventoryItems();
  }, [fetchInventoryItems]);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Item Name", accessor: "itemName" },
    { header: "Price", accessor: "itemPrice" },
    { header: "Quantity", accessor: "itemQuantity" },
  ];

  const filteredItems = inventoryItems.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      String(item.itemName || "").toLowerCase().includes(term) ||
      String(item.id ?? "").toLowerCase().includes(term)
    );
  });
  const handleView = async (row) => {
    const ok = await fetchInventoryItemById(row.id);
    if (ok) {
      setIsEditMode(false);
      setIsModalOpen(true);
    }
  };

  const handleEditFromTable = async (row) => {
    const ok = await fetchInventoryItemById(row.id);
    if (!ok) return;

    setEditValues({
      itemQuantity:
        row.itemQuantity != null ? String(row.itemQuantity) : "",
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    clearSelectedInventory();
  };

  const startEdit = () => {
    if (!selectedInventory) return;
    setEditValues({
      itemQuantity: selectedInventory.itemQuantity ?? "",
    });
    setIsEditMode(true);
  };

  const handleEditFieldChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async () => {
    if (!selectedInventory) return;

    const itemQuantity = Number(editValues.itemQuantity);

    if (Number.isNaN(itemQuantity)) {
      alert("Quantity must be a number");
      return;
    }

    const ok = await updateInventoryItem(selectedInventory.id, {
      itemName: selectedInventory.itemName,
      itemPrice: selectedInventory.itemPrice,
      itemQuantity,
    });

    if (ok) {
      setIsEditMode(false);
      await fetchInventoryItemById(selectedInventory.id);
      toast.success("Inventory quantity updated successfully");
    } else {
      toast.error("Failed to update inventory quantity");
    }
  };

  return (
    <div className="">
      

      <div className="flex items-center justify-between gap-2 mb-7">
        <div>
          <HeadText label="Inventory" />
        </div>
        <div>
          <div>
            <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search inventory..."
          className="w-full max-w-xs px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
          </div>
          
        </div>
        
      </div>

      {loading && <p className="text-gray-500">Loading inventory...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <TableCompo
        columns={columns}
        data={filteredItems}
        pageSize={10}
        onView={handleView}
        onEdit={handleEditFromTable}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-11/12 max-w-md p-6 bg-white shadow-2xl rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Inventory Item Details
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {detailLoading && !selectedInventory && (
              <p className="py-4 text-sm text-center text-gray-500">
                Loading item...
              </p>
            )}

            {!detailLoading && selectedInventory && (
              <div className="overflow-hidden text-sm border border-gray-200 rounded-md">
                <table className="w-full">
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="px-3 py-2 font-semibold text-gray-700">ID</td>
                      <td className="px-3 py-2 text-gray-900">{selectedInventory.id}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-3 py-2 font-semibold text-gray-700">
                        Item Name
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {selectedInventory.itemName}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-3 py-2 font-semibold text-gray-700">Price</td>
                      <td className="px-3 py-2 text-gray-900">
                        {selectedInventory.itemPrice}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-3 py-2 font-semibold text-gray-700">
                        Quantity
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {isEditMode ? (
                          <input
                            type="number"
                            name="itemQuantity"
                            value={editValues.itemQuantity}
                            onChange={handleEditFieldChange}
                            className="w-full px-2 py-1 text-sm border rounded"
                          />
                        ) : (
                          selectedInventory.itemQuantity
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end mt-4 space-x-2">
              {!isEditMode && (
                <button
                  type="button"
                  onClick={startEdit}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
              )}

              {isEditMode && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel edit
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateSubmit}
                    className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
