import React, { useEffect, useState } from "react";

import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, isUserLoading, setSelectedUser, unreadMessages } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [lastSeenTexts, setLastSeenTexts] = useState({});

  console.log("Unread Messages:", unreadMessages);

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

            if (diffInMinutes < 60) {
              newTexts[user._id] = `${diffInMinutes || 1}m`;
            } else if (diffInHours < 24) {
              newTexts[user._id] = `${diffInHours}h`;
            } else {
              newTexts[user._id] = `${diffInDays}d`;
            }
          } else {
            newTexts[user._id] = "offline";
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

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col items-center gap-3">
          <Users className="size-6" />
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1})</span>

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
        <div className="hidden lg:block">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium">Contacts</span>
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

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {/* Green circle for online users */}
                {isOnline && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}

                {/* Mobile version: Show either unread count OR last seen */}
                <div className="lg:hidden">
                  {unreadCount > 0 ? (
                    // Unread message badge - top right
                    <span
                      className="absolute -top-1 -right-1 bg-primary text-white text-[10px]
                      px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  ) : (
                    // Last seen badge - only if no unread messages
                    !isOnline && lastSeenText && (
                      <span
                        className="absolute -top-1 -right-1 bg-zinc-700 text-white text-[10px]
                        px-1.5 py-0.5 rounded-full font-medium"
                      >
                        {lastSeenText}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium truncate">{user.fullName}</div>
                  {/* Desktop: Unread count badge */}
                  {unreadCount > 0 && (
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-bold min-w-[24px] text-center flex-shrink-0">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <div className="text-sm">
                  {isOnline ? (
                    <span className="text-green-500">Online</span>
                  ) : (
                    <span className="text-zinc-400 text-xs">
                      {lastSeenText}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4 text-sm lg:text-base">
            No {showOnlineOnly ? "online" : ""} users
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;