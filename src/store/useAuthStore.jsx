import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLogging: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  //   check the user status
  checkAuth: async () => {
    try {
      const res = axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (err) {
      console.log(`error in check auth`, err.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
