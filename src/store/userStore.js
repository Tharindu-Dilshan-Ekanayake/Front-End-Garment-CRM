import { create } from "zustand";
import { getUsers, getUserById, createUser, deleteUser, patchUser, getUserWorker } from "../apis/userApi";

export const useUserStore = create((set) => ({
	users: [],
	user: null,
	workers: [],
	listLoading: false,
	detailLoading: false,
	error: null,

	// 🔥 GET ALL USERS
	fetchUsers: async () => {
		set({ listLoading: true, error: null });

		try {
			const res = await getUsers();

			set({
				users: res.data,
				listLoading: false
			});

		} catch (err) {
			set({
				error: "Failed to fetch users",
				listLoading: false
			});
		}
	},

	// get user by id
	fetchUserById: async (id) => {
		set({ detailLoading: true, error: null });

		try {
			const res = await getUserById(id);
			set({
				user: res.data,
				detailLoading: false
			});
		} catch (err) {
			set({
				error: "Failed to fetch user",
				detailLoading: false
			});
		}
	},

    //create user
    createUser: async (userData) => {
        set({ detailLoading: true, error: null });

        try {
			const res = await createUser(userData);
			set((state) => ({
				users: [...state.users, res.data],
				user: res.data,
				detailLoading: false
			}));
			return true;
        } catch (err) {
            set({
                error: "Failed to create user",
                detailLoading: false
            });
			return false;
        }
    },

    //delete user by id
    deleteUser: async (id) => {
        set({ detailLoading: true, error: null });

        try {
            await deleteUser(id);
            set((state) => ({
                users: state.users.filter((u) => u.id !== id),
                detailLoading: false
            }));
			return true;
        } catch (err) {
            set({
                error: "Failed to delete user",
                detailLoading: false
            });
			return false;
        }
    },

    //patch user by id
    patchUser: async (id, userData) => {
        set({ detailLoading: true, error: null });

        try {
            const res = await patchUser(id, userData);
            set((state) => ({
                users: state.users.map((u) => (u.id === id ? res.data : u)),
                user: res.data,
                detailLoading: false
            }));
			return true;
        } catch (err) {
            set({
                error: "Failed to update user",
                detailLoading: false
            });
			return false;
        }
    },

	//get user worker list (for mapping ids to names)
	fetchUserWorkers: async () => {
		set({ detailLoading: true, error: null });

		try {
			const res = await getUserWorker();
			set({
				workers: res.data,
				detailLoading: false
			});
		} catch (err) {
			set({
				error: "Failed to fetch user worker",
				detailLoading: false
			});
		}
	},


	// optional clear
	clearUser: () => set({ user: null })

}));

