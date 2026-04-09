import { create } from "zustand";
import { getProductions, getProductionById , createProduction} from "../apis/productionApi";

export const useProductionStore = create((set) => ({
    productions: [],
    selectedProduction: null,
    listLoading: false,
    detailLoading: false,
    error: null,

    //  GET ALL PRODUCTIONS
    fetchProductions: async () => {
        set({ listLoading: true, error: null });
        try {
            const response = await getProductions();
            set({ productions: response.data, listLoading: false });
        } catch (error) {
            set({ error: error.message, listLoading: false });
        }
    },

    //  GET PRODUCTION BY ID
    fetchProductionById: async (id) => {
        set({ detailLoading: true, error: null });
        try {
            const response = await getProductionById(id);
            set({ selectedProduction: response.data, detailLoading: false });
        } catch (error) {
            set({ error: error.message, detailLoading: false });
        }
    },

    //  CREATE PRODUCTION
    createProduction: async (data) => {
        set({ detailLoading: true, error: null });
        try {
            const response = await createProduction(data);
            set((state) => ({
                productions: [...state.productions, response.data],
                detailLoading: false,
            }));
            return true;
        } catch (error) {
            set({ error: error.message || 'Failed to create production', detailLoading: false });
            return false;
        }
    },

}));