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

  logOutUser: async () => {
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
    get().setupSeenListener();
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
        const { selectedUser } = chatState;
        const currentUserId = get().authUser?._id;

        // Ignore own messages
        if (newMessage.senderId === currentUserId) {
          return;
        }

        // Check if message is from currently selected user
        const isMessageFromSelectedUser = selectedUser && selectedUser._id === newMessage.senderId;

        if (isMessageFromSelectedUser) {
          // Add to current chat messages
          const currentMessages = chatState.messages || [];
          useChatStore.setState({
            messages: [...currentMessages, newMessage],
          });
        } else {
          // Add to unread count - ALWAYS update even if not first load
          const currentUnread = chatState.unreadMessages || {};
          const currentCount = currentUnread[newMessage.senderId] || 0;

          useChatStore.setState({
            unreadMessages: {
              ...currentUnread,
              [newMessage.senderId]: currentCount + 1,
            },
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
        console.log("⌨️ User typing event received:", userId);
        useChatStore.setState({ typingUserId: userId });
      });

      socket.on("userStopTyping", ({ userId }) => {
        console.log("⏸️ User stop typing event received:", userId);
        const currentTypingUserId = useChatStore.getState().typingUserId;
        if (currentTypingUserId === userId) {
          useChatStore.setState({ typingUserId: null });
        }
      });
    });
  },

  setupSeenListener: () => {
    const socket = get().socket;
    if (!socket) return;

    import("./useChatStore").then(({ useChatStore }) => {
      // Listen for message seen updates
      socket.on("messageSeenUpdate", ({ userId, messageIds }) => {
        const currentMessages = useChatStore.getState().messages;
        const updatedMessages = currentMessages.map((msg) => {
          // Check if this message ID is in the seen list
          if (messageIds && messageIds.includes(msg._id)) {
            return { ...msg, seen: true, seenBy: userId };
          }
          return msg;
        });

        // Update state immediately - this will trigger re-render
        useChatStore.setState({ messages: updatedMessages });

        // Also trigger a force update flag
        useChatStore.setState({
          lastSeenUpdate: Date.now(),
          lastSeenUserId: userId
        });
      });

      // Listen for chat opened by other user
      socket.on("chatOpenedBy", ({ userId }) => {
        const currentMessages = useChatStore.getState().messages;
        const authUser = get().authUser;

        if (!authUser) {
          return;
        }

        // Mark all messages sent by current user to this userId as seen
        const updatedMessages = currentMessages.map((msg) => {
          // Check if message was sent by me to this user
          const shouldMarkSeen =
            msg.senderId === authUser._id &&
            msg.receiverId === userId;

          if (shouldMarkSeen) {
            return { ...msg, seen: true, seenBy: userId };
          }
          return msg;
        });

        // Update state immediately
        useChatStore.setState({ messages: updatedMessages });

        // Trigger force update
        useChatStore.setState({
          lastSeenUpdate: Date.now(),
          lastSeenUserId: userId
        });
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

  emitMessageSeen: (senderId, messageIds) => {
    const socket = get().socket;
    const authUser = get().authUser;
    if (socket && authUser && messageIds.length > 0) {
      console.log("🔔 Emitting message seen:", { senderId, messageIds });
      socket.emit("messageSeen", {
        senderId,
        receiverId: authUser._id,
        messageIds
      });
    }
  },

  emitChatOpened: (otherUserId) => {
    const socket = get().socket;
    const authUser = get().authUser;
    if (socket && authUser) {
      console.log("👁️ Emitting chat opened to:", otherUserId);
      socket.emit("chatOpened", {
        userId: authUser._id,
        otherUserId
      });
    }
  },
}));