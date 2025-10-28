import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "../../store/useAuthStore";
import { formatMessageTime, getRelativeTime } from "../../lib/formateTime";
import { Check, CheckCheck, Clock } from "lucide-react";

const ChatContainer = () => {
  const {
    getMessages,
    messages,
    isMessagesLoading,
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
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);

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
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);

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
      const unreadMessages = messages.filter(msg =>
        msg.senderId === selectedUser._id &&
        msg.receiverId === authUser._id &&
        !msg.seen &&
        !alreadyMarkedSeenRef.current.has(msg._id) // Check if not already marked
      );

      const unreadMessageIds = unreadMessages.map(msg => msg._id);

      // Emit seen event if there are unread messages
      if (unreadMessageIds.length > 0) {
        // Clear any pending timeout
        if (seenEmitTimeoutRef.current) {
          clearTimeout(seenEmitTimeoutRef.current);
        }

        // Mark as already processed
        unreadMessageIds.forEach(id => alreadyMarkedSeenRef.current.add(id));

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

  if (isMessagesLoading) return <MessageSkeleton />;

  // Check if the typing user is the selected user
  const isSelectedUserTyping = typingUserId === selectedUser?._id;

  return (
    <div className="flex flex-col z flex-1 overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const messageStatus = getMessageStatus(message);
          const isSentByMe = message.senderId === authUser._id;
          const messageSeen = isMessageSeen(message);

          return (
            <div
              key={message._id || message.tempId || Math.random()}
              className={`flex ${
                isSentByMe ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-end gap-2 max-w-[80%]">
                {/* Avatar - left side for received messages */}
                {!isSentByMe && (
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
                        isSentByMe
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
                      rounded-xl shadow-sm cursor-pointer relative
                      ${message.image && !message.text ? 'p-1' : 'p-3'}
                      ${
                        isSentByMe
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
                        className={`sm:max-w-[200px] rounded-md ${message.text ? 'mb-2' : 'rounded-lg'}`}
                      />
                    )}
                    {message.text && <p className="text-sm">{message.text}</p>}

                    {/* Message Status Indicator (only for sent messages) */}
                    {isSentByMe && (
                      <div className={`flex items-center justify-end gap-1 ${message.text ? 'mt-1' : 'absolute bottom-1 right-1 bg-black/30 rounded-full px-1.5 py-0.5'}`}>
                        {messageStatus === "pending" ? (
                          // Pending - Clock icon
                          <Clock className="w-3 h-3 opacity-60" />
                        ) : messageSeen ? (
                          // Seen - show receiver's profile pic
                          <div className="size-4 rounded-full overflow-hidden border-2 border-white/50 flex-shrink-0">
                            <img
                              src={selectedUser.profilePic || "/avatar.png"}
                              alt="seen"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          // Sent but not seen - show double check
                          <CheckCheck className="w-3.5 h-3.5 opacity-70" />
                        )}
                      </div>
                    )}

                    {showRelativeTime[message._id] && (
                      <span
                        className={`
                          text-xs block mt-2 pt-1 border-t
                          ${
                            isSentByMe
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
                {isSentByMe && (
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
          );
        })}

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