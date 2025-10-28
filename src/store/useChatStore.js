import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: null,
  isMessageLoading: false,
  typingUserId: null,
  unreadMessages: {},
  lastSeenUpdate: null,
  lastSeenUserId: null,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const { data } = await axiosInstance.get("/messages/users");
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
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const authUser = useAuthStore.getState().authUser;

    // Create optimistic message
    const optimisticMessage = {
      _id: `temp-${Date.now()}`, // Temporary ID
      tempId: `temp-${Date.now()}`,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      status: "pending", // Mark as pending
    };

    // Add message to UI immediately (optimistic update)
    set({ messages: [...messages, optimisticMessage] });

    try {
      const { data } = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      // Replace optimistic message with real message from server
      set({
        messages: messages
          .filter((msg) => msg.tempId !== optimisticMessage.tempId)
          .concat(data),
      });
    } catch (err) {
      // Remove optimistic message on error
      set({
        messages: messages.filter(
          (msg) => msg.tempId !== optimisticMessage.tempId
        ),
      });
      toast.error(err.response?.data?.message || "Failed to send message");
      throw err; // Re-throw to handle in component
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;

      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });

    // Clear unread messages for this user when chat is opened
    const { unreadMessages } = get();
    if (selectedUser && unreadMessages[selectedUser._id]) {
      const newUnreadMessages = { ...unreadMessages };
      delete newUnreadMessages[selectedUser._id];
      set({ unreadMessages: newUnreadMessages });
    }
  },

  // Clear unread for specific user
  clearUnreadMessages: (userId) => {
    const { unreadMessages } = get();
    const newUnreadMessages = { ...unreadMessages };
    delete newUnreadMessages[userId];
    set({ unreadMessages: newUnreadMessages });
  },
}));