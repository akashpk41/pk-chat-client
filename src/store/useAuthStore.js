import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLogging: false,
  isUpdatingProfile: false,
  onlineUsers : [],
  isCheckingAuth: true,

  //   check the user status
  checkAuth: async () => {
    try {
      const { data } = await axiosInstance.get("/auth/check");
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

  login: async (userData) => {
    set({ isLogging: true });
    try {
      const { data } = await axiosInstance.post("/auth/login", userData);
      set({ authUser: data });
      toast.success("Logged In Successfully!");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isLogging: false });
    }
  },

  logOut: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully");
    } catch (err) {
      toast.error("Something Went Wrong");
    }
  },

  updateProfile: async (userData) => {
    try {
      set({ isUpdatingProfile: true });
      const { data } = await axiosInstance.put(
        "/auth/update-profile",
        userData
      );
      set({ authUser: data });
      toast.success("Profile Updated Successfully");
    } catch (err) {
      console.log("Error in update profile", err.message);

      toast.error("Something Went Wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
