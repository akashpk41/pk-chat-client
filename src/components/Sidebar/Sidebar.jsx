import React, { useEffect, useState } from "react";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    isUserLoading,
    setSelectedUser,
    unreadMessages,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [lastSeenTexts, setLastSeenTexts] = useState({});

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Update last seen texts for offline users
  useEffect(() => {
    const updateLastSeenTexts = () => {
      const newTexts = {};
      users.forEach((user) => {
        if (!onlineUsers.includes(user._id)) {
          const lastSeenDate = user.lastSeen;
          if (lastSeenDate) {
            const now = new Date();
            const lastSeen = new Date(lastSeenDate);
            const diffInMs = now - lastSeen;
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInMinutes < 1) {
              newTexts[user._id] = "Just now";
            } else if (diffInMinutes < 60) {
              newTexts[user._id] = `${diffInMinutes}m ago`;
            } else if (diffInHours < 24) {
              newTexts[user._id] = `${diffInHours}h ago`;
            } else if (diffInDays === 1) {
              newTexts[user._id] = "Yesterday";
            } else if (diffInDays < 7) {
              newTexts[user._id] = `${diffInDays}d ago`;
            } else {
              newTexts[user._id] = "Long time ago";
            }
          } else {
            newTexts[user._id] = "Offline";
          }
        }
      });
      setLastSeenTexts(newTexts);
    };

    updateLastSeenTexts();
    const interval = setInterval(updateLastSeenTexts, 60000);

    return () => clearInterval(interval);
  }, [users, onlineUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  // Calculate total unread count
  const totalUnread = Object.values(unreadMessages || {}).reduce(
    (sum, count) => sum + count,
    0
  );

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 md:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center gap-2">
          <div className="relative">
            <Users className="size-6" />
            {totalUnread > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1})
          </span>

          {/* Filter Toggle for Mobile */}
          <label className="cursor-pointer flex flex-col items-center gap-1">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-[10px] text-zinc-400">Filter</span>
          </label>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="size-6" />
              <span className="font-medium">Contacts</span>
            </div>
            {/* Total unread badge */}
            {totalUnread > 0 && (
              <div className="min-w-[24px] h-6 px-2 bg-primary text-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              </div>
            )}
          </div>

          {/* Online filter toggle */}
          <div className="mt-3 flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">
              ({onlineUsers.length - 1} online)
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const lastSeenText = lastSeenTexts[user._id];
          const unreadCount = unreadMessages?.[user._id] || 0;
          const isSelected = selectedUser?._id === user._id;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full py-3 cursor-pointer flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${isSelected ? "bg-base-300 ring-1 ring-primary/20" : ""}
              `}
            >
              <div className="relative mx-auto md:mx-0">
                {/* Avatar with special ring for unread messages */}
                <div
                  className={`
                  size-12 rounded-full overflow-hidden
                  ${unreadCount > 0 ? "ring-2 ring-primary" : ""}
                `}
                >
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Online status indicator - Green dot (both mobile & desktop) */}
                {isOnline && (
                  <span
                    className="absolute bottom-0 right-0 size-3.5 bg-green-500
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}

                {/* Mobile version badges */}
                <div className="md:hidden">
                  {unreadCount > 0 ? (
                    // Unread count badge - top right (priority over last seen)
                    <span
                      className="absolute -top-1 -right-1 bg-primary text-white text-[10px]
                      px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center shadow-lg"
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  ) : (
                    // Last seen badge - only if offline AND no unread messages
                    !isOnline &&
                    lastSeenText && (
                      <span
                        className="absolute -bottom-1 -right-1 bg-zinc-600 text-white text-[9px]
                        px-1.5 py-0.5 rounded-full font-medium"
                      >
                        {lastSeenText.replace(" ago", "")}
                      </span>
                    )
                  )}
                </div>

                {/* Desktop: Unread count on avatar (optional, already shown next to name) */}
                {/* Keeping desktop clean - badge only in text area */}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden md:block text-left min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div
                    className={`truncate ${
                      unreadCount > 0 ? "font-bold" : "font-medium"
                    }`}
                  >
                    {user.fullName}
                  </div>
                  {/* Desktop: Unread count badge */}
                  {unreadCount > 0 && (
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-bold min-w-[24px] text-center flex-shrink-0 shadow-sm">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                <div className="text-sm">
                  {isOnline ? (
                    <span className="text-green-500 font-medium">
                      ● Active now
                    </span>
                  ) : (
                    <span className="text-zinc-400">
                      Active {lastSeenText || "Offline"}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4 text-sm md:text-base">
            No {showOnlineOnly ? "online" : ""} users
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
