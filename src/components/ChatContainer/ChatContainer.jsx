import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime, getRelativeTime } from "../../lib/formateTime";
import { Check, CheckCheck, Clock, X } from "lucide-react";

const ChatContainer = () => {
  const {
    getMessages,
    messages,
    isMessageLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    typingUserId,
    lastSeenUpdate,
    lastSeenUserId,
    clearUnreadMessages,
  } = useChatStore();
  const { authUser, emitMessageSeen, emitChatOpened } = useAuthStore();
  const messageEndRef = useRef(null);
  const isFirstLoad = useRef(true);
  const previousMessagesLength = useRef(0);
  const previousSeenCount = useRef(0);
  const previousTypingUserId = useRef(null);
  const lastPlayedSeenTimestamp = useRef(0);
  const seenEmitTimeoutRef = useRef(null);
  const alreadyMarkedSeenRef = useRef(new Set());
  const audioContextRef = useRef(null);
  const [showRelativeTime, setShowRelativeTime] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  console.log("Message Loading", isMessageLoading);

  // Initialize Audio Context for receive sound
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
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

  // Play message seen sound (different from receive)
  const playSeenSound = () => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Soft "plop" sound for seen
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      400,
      ctx.currentTime + 0.08
    );

    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  };

  // Play typing sound (soft click)
  const playTypingSound = () => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Quick "tick" sound for typing
    oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      800,
      ctx.currentTime + 0.03
    );

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  };

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    isFirstLoad.current = true;
    previousMessagesLength.current = 0;

    // Emit chat opened event
    emitChatOpened(selectedUser._id);

    return () => unsubscribeFromMessages();
  }, [
    getMessages,
    selectedUser._id,
    subscribeToMessages,
    unsubscribeFromMessages,
    emitChatOpened,
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

  // Detect when messages are seen and play sound (using lastSeenUpdate trigger)
  useEffect(() => {
    if (lastSeenUpdate && !isFirstLoad.current) {
      // Only play if this is a new update (prevent duplicate sounds)
      if (lastSeenUpdate !== lastPlayedSeenTimestamp.current) {
        playSeenSound();
        lastPlayedSeenTimestamp.current = lastSeenUpdate;
      }
    }
  }, [lastSeenUpdate]);

  // Detect when someone starts typing and play sound
  useEffect(() => {
    // Check if typing user changed from null to someone (started typing)
    const isTypingStarted = !previousTypingUserId.current && typingUserId;

    if (isTypingStarted && typingUserId === selectedUser?._id) {
      playTypingSound();
    }

    previousTypingUserId.current = typingUserId;
  }, [typingUserId, selectedUser]);

  // Mark messages as seen when chat is open (with throttling)
  useEffect(() => {
    if (messages.length > 0 && selectedUser && authUser) {
      // Get all unread messages from the selected user
      const unreadMessages = messages.filter(
        (msg) =>
          msg.senderId === selectedUser._id &&
          msg.receiverId === authUser._id &&
          !msg.seen &&
          !alreadyMarkedSeenRef.current.has(msg._id) // Check if not already marked
      );

      const unreadMessageIds = unreadMessages.map((msg) => msg._id);

      // Emit seen event if there are unread messages
      if (unreadMessageIds.length > 0) {
        // Clear any pending timeout
        if (seenEmitTimeoutRef.current) {
          clearTimeout(seenEmitTimeoutRef.current);
        }

        // Mark as already processed
        unreadMessageIds.forEach((id) => alreadyMarkedSeenRef.current.add(id));

        // Throttle emit to once every 500ms
        seenEmitTimeoutRef.current = setTimeout(() => {
          emitMessageSeen(selectedUser._id, unreadMessageIds);
        }, 500);
      }
    }

    // Cleanup
    return () => {
      if (seenEmitTimeoutRef.current) {
        clearTimeout(seenEmitTimeoutRef.current);
      }
    };
  }, [messages, selectedUser, authUser, emitMessageSeen]);

  // Reset seen tracking when changing chat
  useEffect(() => {
    alreadyMarkedSeenRef.current.clear();
  }, [selectedUser?._id]);

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

  // Check message status (sent or pending)
  const getMessageStatus = (message) => {
    // If message has _id from database, it's sent successfully
    if (message._id && message._id.length > 10) {
      return "sent";
    }
    // If message is just created (temporary id or no id), it's pending
    return "pending";
  };

  // Check if message is seen
  const isMessageSeen = (message) => {
    // Check if message has seen property and it's true
    return message.seen === true || message.seenBy;
  };

  if (isMessageLoading) return <MessageSkeleton />;

  // Check if the typing user is the selected user
  const isSelectedUserTyping = typingUserId === selectedUser?._id;

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
        {/* Empty Chat State - First Time Conversation */}
        {messages.length === 0 && !isMessageLoading && (
        <div className="flex flex-col items-center mt-6 h-full space-y-2 px-2">
  <div className="relative inline-block">
    <div className="size-40 rounded-full border-4 border-primary/30 overflow-hidden shadow-2xl shadow-primary/20 ring-4 ring-primary/10">
      <img
        src={selectedUser.profilePic || "/avatar.png"}
        alt="profile pic"
        className="w-full h-full object-cover"
      />
    </div>
    {/* Blue Verify Badge on Image */}
    <div className="absolute bottom-3 right-3">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="drop-shadow-xl">
        <circle cx="12" cy="12" r="11" fill="url(#blueGradient)" />
        <path d="M8 12.5l2.5 2.5L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#0088ff" />
            <stop offset="100%" stopColor="#0066ff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>

  <div className="text-center space-y-3 max-w-md">
    <h3 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
      {selectedUser.fullName}
    </h3>

    <div className="badge badge-primary badge-lg gap-2 px-4 py-3">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
      </svg>
      Connected on Chat
    </div>

    <p className="text-base-content/70 text-lg font-medium">
      Start your conversation now
    </p>

    <div className="flex items-center justify-center gap-2 text-sm text-base-content/60">
      <span>Say hi to break the ice</span>
      <span className="text-2xl animate-bounce">👋</span>
    </div>
  </div>
</div>
        )}

        {messages.map((message) => {
          const messageStatus = getMessageStatus(message);
          const isSentByMe = message.senderId === authUser._id;
          const messageSeen = isMessageSeen(message);

          return (
            <div
              key={message._id || message.tempId || Math.random()}
              className={`flex items-end gap-2 ${isSentByMe ? "justify-end" : "justify-start"}`}
            >
              {/* Avatar - left side for received messages */}
              {!isSentByMe && (
                <div className="size-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-base-300 shadow-md">
                  <img
                    src={selectedUser.profilePic || "/avatar.png"}
                    alt="profile pic"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className={`flex flex-col max-w-[75%] sm:max-w-[60%] ${isSentByMe ? "items-end" : "items-start"}`}>
                {/* Timestamp */}
                <p className={`text-xs mb-1.5 px-2 text-base-content/50 font-medium`}>
                  {formatMessageTime(message.createdAt)}
                </p>

                {/* Message bubble */}
                <div
                  className={`
                    group relative rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl
                    ${message.image && !message.text ? "p-1" : "px-4 py-2.5"}
                    ${
                      isSentByMe
                        ? "bg-primary text-primary-content rounded-br-md"
                        : "bg-base-200 text-base-content rounded-bl-md"
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
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={message.image}
                        alt="Attachment"
                        className={`max-w-[200px] sm:max-w-[320px] rounded-xl cursor-pointer transition-transform hover:scale-[1.02] ${
                          message.text ? "mb-2" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(message.image);
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
                    </div>
                  )}

                  {message.text && (
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                  )}

                  {/* Message Status Indicator (only for sent messages) */}
                  {isSentByMe && (
                    <div
                      className={`flex items-center justify-start gap-1 ${
                        message.text
                          ? "mt-1"
                          : "absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1"
                      }`}
                    >
                      {messageStatus === "pending" ? (
                        <Clock className="w-3.5 h-3.5 opacity-70 animate-pulse" />
                      ) : messageSeen ? (
                        <div className="size-4 rounded-full overflow-hidden border border-success flex-shrink-0  shadow-sm">
                          <img
                            src={selectedUser.profilePic || "/avatar.png"}
                            alt="seen"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <CheckCheck className="w-4 h-4 opacity-80" />
                      )}
                    </div>
                  )}

                  {showRelativeTime[message._id] && (
                    <div
                      className={`
                        text-xs mt-2 pt-2 border-t font-medium
                        ${
                          isSentByMe
                            ? "text-primary-content/70 border-primary-content/30"
                            : "text-base-content/70 border-base-content/30"
                        }
                      `}
                    >
                      {getRelativeTime(message.createdAt)}
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar - right side for sent messages */}
              {isSentByMe && (
                <div className="size-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/30 shadow-md">
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="profile pic"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator - Only show when selected user is typing */}
        {isSelectedUserTyping && (
          <div className="flex items-end gap-2 justify-start">
            <div className="size-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/30 shadow-md animate-pulse">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt="profile pic"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold text-primary px-2 mb-1.5">
                {selectedUser.fullName} is typing...
              </span>
              <div className="bg-base-200 rounded-2xl rounded-bl-md px-5 py-3 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 btn btn-circle btn-ghost text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[90vh] animate-in zoom-in-95 duration-300">
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;