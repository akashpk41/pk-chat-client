import React, { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";

const ChatContainer = () => {
  const { getMessages, messages, isMessageLoading, selectedUser } =
    useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [getMessages, selectedUser._id]);

  if (isMessageLoading) return <MessageSkeleton />;

  return <div className="flex flex-col flex-1  overflow-auto"> <ChatHeader /> Messages...  <MessageInput /> </div>;
};

export default ChatContainer;
