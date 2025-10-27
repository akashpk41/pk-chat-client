import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

// ✅ NAMED EXPORT - এভাবে export করুন
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const { data } = await axiosInstance.get("/auth/check");
      set({ authUser: data });
      get().connectSocket();
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
      get().connectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (userData) => {
    set({ isLoggingIn: true });
    try {
      const { data } = await axiosInstance.post("/auth/login", userData);
      set({ authUser: data });
      toast.success("Logged In Successfully!");
      get().connectSocket();
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logOut: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully");
      get().disconnectSocket();
    } catch (err) {
      toast.error("Something Went Wrong");
    }
  },

  updateProfile: async (userData) => {
    try {
      set({ isUpdatingProfile: true });
      const { data } = await axiosInstance.put("/auth/update-profile", userData);
      set({ authUser: data });
      toast.success("Profile Updated Successfully");
    } catch (err) {
      console.log("Error in update profile", err.message);
      toast.error("Something Went Wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    get().setupGlobalMessageListener();
    get().setupTypingListener();
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  setupGlobalMessageListener: () => {
    const socket = get().socket;
    if (!socket) return;

    import("./useChatStore").then(({ useChatStore }) => {
      socket.on("newMessage", (newMessage) => {
        const chatState = useChatStore.getState();
        const { selectedUser, unreadMessages = {} } = chatState;
        const currentUserId = get().authUser?._id;

        if (newMessage.senderId === currentUserId) {
          return;
        }

        if (!selectedUser || selectedUser._id !== newMessage.senderId) {
          const currentCount = unreadMessages[newMessage.senderId] || 0;
          const newCount = currentCount + 1;

          useChatStore.setState({
            unreadMessages: {
              ...unreadMessages,
              [newMessage.senderId]: newCount,
            },
          });
        } else {
          const currentMessages = chatState.messages || [];
          useChatStore.setState({
            messages: [...currentMessages, newMessage],
          });
        }
      });
    });
  },

  setupTypingListener: () => {
    const socket = get().socket;
    if (!socket) return;

    import("./useChatStore").then(({ useChatStore }) => {
      socket.on("userTyping", ({ userId }) => {
        useChatStore.setState({ typingUserId: userId });
      });

      socket.on("userStopTyping", ({ userId }) => {
        const currentTypingUserId = useChatStore.getState().typingUserId;
        if (currentTypingUserId === userId) {
          useChatStore.setState({ typingUserId: null });
        }
      });
    });
  },

  emitTyping: (receiverId) => {
    const socket = get().socket;
    const authUser = get().authUser;
    if (socket && authUser) {
      socket.emit("typing", { senderId: authUser._id, receiverId });
    }
  },

  emitStopTyping: (receiverId) => {
    const socket = get().socket;
    const authUser = get().authUser;
    if (socket && authUser) {
      socket.emit("stopTyping", { senderId: authUser._id, receiverId });
    }
  },
}));
