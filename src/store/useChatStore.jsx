import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";

export const useChatStore = create((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: null,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const { data } = await axiosInstance.get("/messages/user");
      set({ users: data });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const { data } = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: data });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  //   todo :
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
