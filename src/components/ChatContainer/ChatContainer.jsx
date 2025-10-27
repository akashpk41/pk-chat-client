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
  const previousMessagesLength = useRef(0);
  const audioContextRef = useRef(null);
  const [showRelativeTime, setShowRelativeTime] = useState({});

  // Initialize Audio Context for receive sound
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play message receive sound
  const playReceiveSound = () => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Pleasant "ding" receive sound with two tones
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  };

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    isFirstLoad.current = true;
    previousMessagesLength.current = 0;

    return () => unsubscribeFromMessages();
  }, [
    getMessages,
    selectedUser._id,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // Detect new messages and play sound
  useEffect(() => {
    if (messages.length > 0 && !isFirstLoad.current) {
      // Check if new message is received (not sent by current user)
      if (messages.length > previousMessagesLength.current) {
        const lastMessage = messages[messages.length - 1];

        // Play sound only if message is from another user
        if (lastMessage.senderId !== authUser._id) {
          playReceiveSound();
        }
      }
    }

    previousMessagesLength.current = messages.length;
  }, [messages, authUser._id]);

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
  className={`flex ${
    message.senderId === authUser._id ? "justify-end" : "justify-start"
  }`}
>
  <div className="flex items-end gap-2 max-w-[80%]">
    {/* Avatar - left side for received messages */}
    {message.senderId !== authUser._id && (
      <div className="size-10 rounded-full border overflow-hidden flex-shrink-0">
        <img
          src={selectedUser.profilePic || "/avatar.png"}
          alt="profile pic"
          className="w-full h-full object-cover"
        />
      </div>
    )}

    <div className="flex flex-col">

      <p
        className={`
          text-[13px] mb-1 px-2
          ${
            message.senderId === authUser._id
              ? "text-right text-base-content/50"
              : "text-left text-base-content/50"
          }
        `}
      >
        {formatMessageTime(message.createdAt)}
      </p>

      {/* Message bubble */}
      <div
        className={`
          rounded-xl p-3 shadow-sm cursor-pointer
          ${
            message.senderId === authUser._id
              ? "bg-primary text-primary-content"
              : "bg-base-200"
          }
        `}
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
        {message.text && <p className="text-sm">{message.text}</p>}

        {showRelativeTime[message._id] && (
          <span
            className={`
              text-xs block mt-2 pt-1 border-t
              ${
                message.senderId === authUser._id
                  ? "text-primary-content/60 border-primary-content/20"
                  : "text-base-content/60 border-base-content/20"
              }
            `}
          >
            {getRelativeTime(message.createdAt)}
          </span>
        )}
      </div>
    </div>

    {/* Avatar - right side for sent messages */}
    {message.senderId === authUser._id && (
      <div className="size-10 rounded-full border overflow-hidden flex-shrink-0">
        <img
          src={authUser.profilePic || "/avatar.png"}
          alt="profile pic"
          className="w-full h-full object-cover"
        />
      </div>
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