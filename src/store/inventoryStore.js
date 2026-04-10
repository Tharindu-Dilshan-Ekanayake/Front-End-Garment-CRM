import { create } from "zustand";
import {
    getInventoryItems,
    getInventoryItemById as apiGetInventoryItemById,
    createInventoryItem as apiCreateInventoryItem,
    updateInventoryItem as apiUpdateInventoryItem,
    deleteInventoryItem as apiDeleteInventoryItem,
} from "../apis/inventoryApi";

export const useInventoryStore = create((set) => ({
    inventoryItems: [],
    selectedInventory: null,
    loading: false,
    detailLoading: false,
    error: null,
    searchTerm: "",

    //  GET ALL INVENTORY ITEMS
    fetchInventoryItems: async () => {
        set({ loading: true, error: null });
        try {
            const response = await getInventoryItems();
            set({ inventoryItems: response.data, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch inventory", loading: false });
        }
    },

    // GET SINGLE INVENTORY ITEM BY ID (FOR VIEW MODAL)
    fetchInventoryItemById: async (id) => {
        set({ detailLoading: true, error: null });
        try {
            const res = await apiGetInventoryItemById(id);
            set({ selectedInventory: res.data, detailLoading: false });
            return true;
        } catch (err) {
            set({ error: "Failed to fetch inventory item", detailLoading: false });
            return false;
        }
    },

    clearSelectedInventory: () => set({ selectedInventory: null }),

    setSearchTerm: (term) => set({ searchTerm: term }),

    // CREATE INVENTORY ITEM (ADMIN ONLY IN UI)
    createInventoryItem: async (data) => {
        set({ detailLoading: true, error: null });
        try {
            const res = await apiCreateInventoryItem(data);
            set((state) => ({
                inventoryItems: [...state.inventoryItems, res.data],
                detailLoading: false,
            }));
            return true;
        } catch (err) {
            set({ error: "Failed to create inventory item", detailLoading: false });
            return false;
        }
    },

    // UPDATE INVENTORY ITEM (ADMIN + MANAGER IN UI)
    updateInventoryItem: async (id, data) => {
        set({ detailLoading: true, error: null });
        try {
            const res = await apiUpdateInventoryItem(id, data);
            set((state) => ({
                inventoryItems: state.inventoryItems.map((item) =>
                    item.id === id ? res.data : item
                ),
                detailLoading: false,
            }));
            return true;
        } catch (err) {
            set({ error: "Failed to update inventory item", detailLoading: false });
            return false;
        }
    },

    // DELETE INVENTORY ITEM (ADMIN ONLY IN UI)
    deleteInventoryItem: async (id) => {
        set({ detailLoading: true, error: null });
        try {
            await apiDeleteInventoryItem(id);
            set((state) => ({
                inventoryItems: state.inventoryItems.filter((item) => item.id !== id),
                detailLoading: false,
            }));
            return true;
        } catch (err) {
            set({ error: "Failed to delete inventory item", detailLoading: false });
            return false;
        }
    },
}));

