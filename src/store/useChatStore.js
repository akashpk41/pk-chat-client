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
      _id: `temp-${Date.now()}`,
      tempId: `temp-${Date.now()}`,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const { data } = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({
        messages: messages
          .filter((msg) => msg.tempId !== optimisticMessage.tempId)
          .concat(data),
      });
    } catch (err) {
      set({
        messages: messages.filter(
          (msg) => msg.tempId !== optimisticMessage.tempId
        ),
      });
      toast.error(err.response?.data?.message || "Failed to send message");
      throw err;
    }
  },

  editMessage: async (messageId, newText) => {
    const { messages } = get();

    // Optimistic update
    const updatedMessages = messages.map((msg) =>
      msg._id === messageId
        ? { ...msg, text: newText, edited: true, editedAt: new Date().toISOString() }
        : msg
    );
    set({ messages: updatedMessages });

    try {
      const { data } = await axiosInstance.put(`/messages/edit/${messageId}`, {
        text: newText,
      });

      // Update with server response
      set({
        messages: messages.map((msg) =>
          msg._id === messageId ? data : msg
        ),
      });

      toast.success("Message edited successfully");
    } catch (err) {
      // Revert on error
      set({ messages });
      toast.error(err.response?.data?.message || "Failed to edit message");
      throw err;
    }
  },

  //  Delete Message Function
  deleteMessage: async (messageId) => {
    const { messages } = get();
    const authUser = useAuthStore.getState().authUser;

    // Find the message to get sender info
    const messageToDelete = messages.find(msg => msg._id === messageId);

    // Optimistic update - mark as deleted with sender name
    const updatedMessages = messages.map((msg) =>
      msg._id === messageId
        ? {
            ...msg,
            deleted: true,
            deletedBy: authUser.fullName,
            text: `${authUser.fullName} deleted this message`,
            image: null
          }
        : msg
    );
    set({ messages: updatedMessages });

    try {
      await axiosInstance.delete(`/messages/delete/${messageId}`);
      toast.success("Message deleted successfully");
    } catch (err) {
      // Revert on error
      set({ messages });
      toast.error(err.response?.data?.message || "Failed to delete message");
      throw err;
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

    // ✅ Listen for message edited
    socket.on("messageEdited", (editedMessage) => {
      const { messages } = get();
      set({
        messages: messages.map((msg) =>
          msg._id === editedMessage._id ? editedMessage : msg
        ),
      });
    });

    // ✅ Listen for message deleted
    socket.on("messageDeleted", (messageId) => {
      const { messages } = get();
      const authUser = useAuthStore.getState().authUser;

      set({
        messages: messages.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                deleted: true,
                deletedBy: selectedUser.fullName,
                text: `${selectedUser.fullName} deleted this message`,
                image: null
              }
            : msg
        ),
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageEdited");
    socket.off("messageDeleted");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });

    const { unreadMessages } = get();
    if (selectedUser && unreadMessages[selectedUser._id]) {
      const newUnreadMessages = { ...unreadMessages };
      delete newUnreadMessages[selectedUser._id];
      set({ unreadMessages: newUnreadMessages });
    }
  },

  clearUnreadMessages: (userId) => {
    const { unreadMessages } = get();
    const newUnreadMessages = { ...unreadMessages };
    delete newUnreadMessages[userId];
    set({ unreadMessages: newUnreadMessages });
  },
}));