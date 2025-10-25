import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLogging: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  //   check the user status
  checkAuth: async () => {
    try {
      const { data } = axiosInstance.get("/auth/check");
      set({ authUser: data });
    } catch (err) {
      console.log(`error in check auth`, err.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (userData) => {
    set({ isSigningUp: true });
    try {
      const { data } = await axiosInstance.post("/auth/signup", userData);
      set({ authUser: data });
      toast.success("Account Created Successfully!");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
