import { create } from "zustand";
import { loginApi } from "../apis/authApi";
import { jwtDecode } from "jwt-decode";

// Initialize state from token (if it exists)
const storedToken = localStorage.getItem("token");
let initialUser = null;
let initialRole = null;

if (storedToken) {
  try {
    const decoded = jwtDecode(storedToken);
    initialRole = decoded.role;
    initialUser = decoded.sub;
  } catch (e) {
    // if token is invalid, clear it
    localStorage.removeItem("token");
  }
}

export const useAuthStore = create((set) => ({
  token: storedToken || null,
  user: initialUser,
  role: initialRole,
  loading: false,
  error: null,

  login: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await loginApi(data);

      const token = res.data.token;

      // save token
      localStorage.setItem("token", token);

      // 🔥 decode token
      const decoded = jwtDecode(token);

      // assume token contains role + email
      const role = decoded.role;
      const user = decoded.sub;

      set({
        token,
        role,
        user,
        loading: false
      });

      return role; // return for navigation

    } catch (err) {
      set({
        error: "Invalid credentials",
        loading: false
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, role: null });
  }
}));