import { X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import { formatLastSeen } from "../../lib/formatLastSeen";
import ChatHeaderSkeleton from "../skeletons/ChatHeaderSkeleton";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [lastSeenText, setLastSeenText] = useState("");

  useEffect(() => {
    if (!onlineUsers.includes(selectedUser._id)) {
      setLastSeenText(formatLastSeen(selectedUser.lastSeen));

      const interval = setInterval(() => {
        setLastSeenText(formatLastSeen(selectedUser.lastSeen));
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [selectedUser._id, onlineUsers, selectedUser.lastSeen]);

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-2.5 border-b border-base-300">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="avatar">
        <div className="size-10 rounded-full relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
          />
        </div>
      </div>
      {/* User info */}
      <div>
        <div className="flex items-center gap-1.5">
        <h3 className="font-semibold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
  {selectedUser.fullName}
</h3>
          {/* Premium Verify Badge */}
          <div className="relative inline-flex">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-md"
            >
              <circle
                cx="12"
                cy="12"
                r="11"
                fill="url(#blueGradient)"
              />
              <path
                d="M8 12.5l2.5 2.5L16 9"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="blueGradient"
                  x1="0"
                  y1="0"
                  x2="24"
                  y2="24"
                >
                  <stop offset="0%" stopColor="#0088ff" />
                  <stop offset="100%" stopColor="#0066ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
       <div className="flex items-center gap-1.5">
  <p className={`text-sm font-medium ${isOnline ? "text-green-500" : "text-slate-500"}`}>
    {isOnline ? "Online" : lastSeenText}
  </p>
  {isOnline && (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
    </span>
  )}
</div>
      </div>
    </div>
    {/* Close button */}
    <button onClick={() => setSelectedUser(null)}>
      <X />
    </button>
  </div>
</div>
  );
};

export default ChatHeader;