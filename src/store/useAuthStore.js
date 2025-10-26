import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogging: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,

  //   check the user status
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
    set({ isLogging: true });
    try {
      const { data } = await axiosInstance.post("/auth/login", userData);
      set({ authUser: data });
      toast.success("Logged In Successfully!");

      get().connectSocket();
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
      get().disconnectSocket();
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

    // Setup global message listener for unread count
    get().setupGlobalMessageListener();
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
setupGlobalMessageListener: () => {
  const socket = get().socket;
  if (!socket) return;

  console.log("Setting up global message listener...");

  // Import useChatStore dynamically to avoid circular dependency
  import("./useChatStore").then(({ useChatStore }) => {
    console.log("useChatStore imported successfully");

    socket.on("newMessage", (newMessage) => {
      console.log("New message received in global listener:", newMessage);

      const chatState = useChatStore.getState();
      const { selectedUser, unreadMessages = {} } = chatState;
      const currentUserId = get().authUser?._id;

      console.log("Current user ID:", currentUserId);
      console.log("Message sender ID:", newMessage.senderId);
      console.log("Selected user:", selectedUser);
      console.log("Current unread messages:", unreadMessages);

      if (newMessage.senderId === currentUserId) {
        console.log("Message is from current user, ignoring...");
        return;
      }

      if (!selectedUser || selectedUser._id !== newMessage.senderId) {
        const currentCount = unreadMessages[newMessage.senderId] || 0;
        const newCount = currentCount + 1;

        console.log("Updating unread count:", {
          senderId: newMessage.senderId,
          oldCount: currentCount,
          newCount: newCount
        });

        useChatStore.setState({
          unreadMessages: {
            ...unreadMessages,
            [newMessage.senderId]: newCount,
          },
        });

        console.log("Updated unread messages:", useChatStore.getState().unreadMessages);
      } else {
        console.log("Chat is open with sender, adding to messages...");
        const currentMessages = chatState.messages || [];
        useChatStore.setState({
          messages: [...currentMessages, newMessage],
        });
      }
    });
  });
},
}));