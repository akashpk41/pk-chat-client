import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime, getRelativeTime } from "../../lib/formateTime";

const ChatContainer = () => {
  const {
    getMessages,
    messages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    typingUserId,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const isFirstLoad = useRef(true);
  const [showRelativeTime, setShowRelativeTime] = useState({});

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    isFirstLoad.current = true;

    return () => unsubscribeFromMessages();
  }, [
    getMessages,
    selectedUser._id,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // auto scroll to the last message
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      if (isFirstLoad.current) {
        // First load - instant scroll without animation
        messageEndRef.current.scrollIntoView({ behavior: "instant" });
        isFirstLoad.current = false;
      } else {
        // New messages - smooth scroll
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, typingUserId]);

  if (isMessagesLoading) return <MessageSkeleton />;

  // Check if the typing user is the selected user
  const isSelectedUserTyping = typingUserId === selectedUser?._id;

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className="chat-bubble flex flex-col cursor-pointer"
              onClick={() =>
                setShowRelativeTime((prev) => ({
                  ...prev,
                  [message._id]: !prev[message._id],
                }))
              }
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
              {showRelativeTime[message._id] && (
                <span className="text-xs opacity-60 mt-1">
                  {getRelativeTime(message.createdAt)}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isSelectedUserTyping && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-bubble bg-base-200">
              <div className="flex items-center gap-1">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;