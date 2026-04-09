import { create } from "zustand";
import { getProductions, getProductionById , createProduction, patchProduction, deleteProduction, getLeaderTasks, getMemberTasks, patchTaskAssignment} from "../apis/productionApi";

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

    //  PATCH PRODUCTION BY ID (update only allowed fields, e.g. item & itemQuantity)
    patchProduction: async (id, data) => {
        set({ detailLoading: true, error: null });
        try {
            await patchProduction(id, data);
            set((state) => ({
                productions: state.productions.map((prod) =>
                    prod.taskId === id ? { ...prod, ...data } : prod
                ),
                selectedProduction:
                    state.selectedProduction && state.selectedProduction.taskId === id
                        ? { ...state.selectedProduction, ...data }
                        : state.selectedProduction,
                detailLoading: false,
            }));
            return true;
        } catch (error) {
            set({ error: error.message || 'Failed to update production', detailLoading: false });
            return false;
        }
    },

    // delete production by id
    deleteProduction: async (id) => {
        set({ detailLoading: true, error: null });
        try {
            await deleteProduction(id);
            set((state) => ({
                productions: state.productions.filter((prod) => prod.taskId !== id),
                detailLoading: false,
            }));
            return true;
        } catch (error) {
            set({ error: error.message || 'Failed to delete production', detailLoading: false });
            return false;
        }
    },

    // get leader tasks
    fetchLeaderTasks: async () => {
        set({ listLoading: true, error: null });
        try {
            const response = await getLeaderTasks();
            set({ productions: response.data, listLoading: false });
        } catch (error) {
            set({ error: error.message, listLoading: false });
        }
    },

    // get member tasks
    fetchMemberTasks: async () => {
        set({ listLoading: true, error: null });
        try {
            const response = await getMemberTasks();
            set({ productions: response.data, listLoading: false });
        } catch (error) {
            set({ error: error.message, listLoading: false });
        }
    },

    // patch single task assignment by its assignment id
    patchTaskAssignment: async (assignmentId, assignmentData) => {
        set({ detailLoading: true, error: null });
        try {
            await patchTaskAssignment(assignmentId, assignmentData);
            set({ detailLoading: false });
            return true;
        } catch (error) {
            set({ error: error.message || 'Failed to update task assignment', detailLoading: false });
            return false;
        }
    }
}));