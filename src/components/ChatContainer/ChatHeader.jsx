import { X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import { formatLastSeen } from "../../lib/formatLastSeen";

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
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : lastSeenText}
            </p>
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
