import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import TableCompo from "../../components/TableCompo";
import PrimaryButton from "../../components/PrimaryButton";
import InputComponent from "../../components/InputComponent";
import { useInventoryStore } from "../../store/inventoryStore";
import HeadText from "../../components/HeadText";

export default function AdminInventoryManagement() {
  const {
    inventoryItems,
    loading,
    error,
    searchTerm,
    selectedInventory,
    detailLoading,
    fetchInventoryItems,
    setSearchTerm,
    fetchInventoryItemById,
    clearSelectedInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  } = useInventoryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editValues, setEditValues] = useState({
    itemName: "",
    itemPrice: "",
    itemQuantity: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemPrice: "",
    itemQuantity: "",
  });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
      String(item.itemName || "")
        .toLowerCase()
        .includes(term) ||
      String(item.id ?? "")
        .toLowerCase()
        .includes(term)
    );
  });
  const openCreateModal = () => {
    setNewItem({ itemName: "", itemPrice: "", itemQuantity: "" });
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = newItem.itemName.trim();
    const itemPrice = Number(newItem.itemPrice);
    const itemQuantity = Number(newItem.itemQuantity);

    if (!trimmedName || Number.isNaN(itemPrice) || Number.isNaN(itemQuantity)) {
      alert("Please enter a valid name, price and quantity");
      return;
    }

    const ok = await createInventoryItem({
      itemName: trimmedName,
      itemPrice,
      itemQuantity,
    });

    if (ok) {
      setIsCreateModalOpen(false);
      toast.success("Inventory item created successfully");
    } else {
      toast.error("Failed to create inventory item");
    }
  };

  const handleView = async (row) => {
    const ok = await fetchInventoryItemById(row.id);
    if (ok) {
      setIsEditMode(false);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    clearSelectedInventory();
  };

  const startEdit = () => {
    if (!selectedInventory) return;
    setEditValues({
      itemName: selectedInventory.itemName || "",
      itemPrice: selectedInventory.itemPrice ?? "",
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

    const itemPrice = Number(editValues.itemPrice);
    const itemQuantity = Number(editValues.itemQuantity);

    if (Number.isNaN(itemPrice) || Number.isNaN(itemQuantity)) {
      alert("Price and quantity must be numbers");
      return;
    }

    const ok = await updateInventoryItem(selectedInventory.id, {
      itemName: editValues.itemName,
      itemPrice,
      itemQuantity,
    });

    if (ok) {
      setIsEditMode(false);
      await fetchInventoryItemById(selectedInventory.id);
      toast.success("Inventory item updated successfully");
    } else {
      toast.error("Failed to update inventory item");
    }
  };

  const handleDeleteInModal = async () => {
    if (!selectedInventory) return;
    setDeleteTarget(selectedInventory);
    setIsDeleteConfirmOpen(true);
  };

  const handleEditFromTable = async (row) => {
    const ok = await fetchInventoryItemById(row.id);
    if (!ok) return;

    setEditValues({
      itemName: row.itemName || "",
      itemPrice: row.itemPrice != null ? String(row.itemPrice) : "",
      itemQuantity: row.itemQuantity != null ? String(row.itemQuantity) : "",
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteFromTable = async (row) => {
    setDeleteTarget(row);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const ok = await deleteInventoryItem(deleteTarget.id);
    if (ok) {
      toast.success("Inventory item deleted successfully");
      setIsDeleteConfirmOpen(false);
      setDeleteTarget(null);

      if (selectedInventory && selectedInventory.id === deleteTarget.id) {
        closeModal();
      }
    } else {
      toast.error("Failed to delete inventory item");
    }
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="">
      <div className="flex flex-col justify-between gap-3 mb-4 sm:flex-row">
        <div className="item-start">
          <HeadText label="Inventory" />
        </div>
        <div className="flex gap-3">
          <div>
          <PrimaryButton
            label="Add Inventory Item"
            color="green"
            onClick={openCreateModal}
          />
        </div>
        <div className="">
          <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search inventory..."
          className="w-full h-10 max-w-sm px-3 py-2 border border-gray-300 rounded"
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
        onDelete={handleDeleteFromTable}
      />

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-11/12 max-w-md p-6 bg-white shadow-2xl rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Add Inventory Item
              </h2>
              <button
                type="button"
                onClick={closeCreateModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-2 text-sm">
              <InputComponent
                label="Item name"
                name="itemName"
                value={newItem.itemName}
                onChange={handleCreateChange}
                placeholder="Enter item name"
              />
              <InputComponent
                label="Item price"
                type="number"
                name="itemPrice"
                value={newItem.itemPrice}
                onChange={handleCreateChange}
                placeholder="Enter item price"
              />
              <InputComponent
                label="Quantity"
                type="number"
                name="itemQuantity"
                value={newItem.itemQuantity}
                onChange={handleCreateChange}
                placeholder="Enter quantity"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 text-xs text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                      <td className="px-3 py-2 font-semibold text-gray-700">
                        ID
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {selectedInventory.id}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-3 py-2 font-semibold text-gray-700">
                        Item Name
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {isEditMode ? (
                          <input
                            type="text"
                            name="itemName"
                            value={editValues.itemName}
                            onChange={handleEditFieldChange}
                            className="w-full px-2 py-1 text-sm border rounded"
                          />
                        ) : (
                          selectedInventory.itemName
                        )}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-3 py-2 font-semibold text-gray-700">
                        Price
                      </td>
                      <td className="px-3 py-2 text-gray-900">
                        {isEditMode ? (
                          <input
                            type="number"
                            name="itemPrice"
                            value={editValues.itemPrice}
                            onChange={handleEditFieldChange}
                            className="w-full px-2 py-1 text-sm border rounded"
                          />
                        ) : (
                          selectedInventory.itemPrice
                        )}
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
                <>
                  <button
                    type="button"
                    onClick={handleDeleteInModal}
                    className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={startEdit}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </>
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

      {isDeleteConfirmOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-11/12 max-w-sm p-5 bg-white rounded-lg shadow-2xl">
            <h3 className="mb-3 text-base font-semibold text-gray-900">
              Delete inventory item
            </h3>
            <p className="mb-4 text-sm text-gray-700">
              Are you sure you want to delete
              <span className="font-semibold"> {deleteTarget.itemName}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelDelete}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
