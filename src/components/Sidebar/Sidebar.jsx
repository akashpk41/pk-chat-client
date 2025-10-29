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

  // Sort users by activity: Unread > Online > Recently Active > Others
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aIsOnline = onlineUsers.includes(a._id);
    const bIsOnline = onlineUsers.includes(b._id);
    const aUnread = unreadMessages?.[a._id] || 0;
    const bUnread = unreadMessages?.[b._id] || 0;

    // Priority 1: Users with unread messages come first
    if (aUnread > 0 && bUnread === 0) return -1;
    if (bUnread > 0 && aUnread === 0) return 1;

    // Priority 2: Both have unread - sort by unread count (higher first)
    if (aUnread > 0 && bUnread > 0) {
      return bUnread - aUnread;
    }

    // Priority 3: Online users before offline
    if (aIsOnline && !bIsOnline) return -1;
    if (bIsOnline && !aIsOnline) return 1;

    // Priority 4: Both online - sort by name
    if (aIsOnline && bIsOnline) {
      return a.fullName.localeCompare(b.fullName);
    }

    // Priority 5: Both offline - sort by last seen time (most recent first)
    const aLastSeen = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
    const bLastSeen = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;

    return bLastSeen - aLastSeen; // Descending order (newest first)
  });

  // Calculate total unread count
  const totalUnread = Object.values(unreadMessages || {}).reduce((sum, count) => sum + count, 0);

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col items-center gap-2">
          <div className="relative">
            <Users className="size-6" />
            {totalUnread > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </div>
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
        {sortedUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const lastSeenText = lastSeenTexts[user._id];
          const unreadCount = unreadMessages?.[user._id] || 0;
          const isSelected = selectedUser?._id === user._id;

          return (
        <button
  key={user._id}
  onClick={() => setSelectedUser(user)}
  className={`
    w-full py-3 flex cursor-pointer items-center gap-3
    hover:bg-base-300 transition-colors
  `}
>
  <div className="relative mx-auto lg:mx-0">
    {/* Avatar with special ring for unread or selected */}
    <div
      className={`
        size-12 rounded-full overflow-hidden relative
        ${unreadCount > 0 ? "ring-2 ring-primary" : ""}
        ${isSelected ? "ring-4 ring-secondary ring-offset-2 ring-offset-base-100" : ""}
      `}
    >
      <img
        src={user.profilePic || "/avatar.png"}
        alt={user.fullName}
        className="w-full h-full object-cover rounded-full"
      />
    </div>

    {/* Online status indicator outside avatar */}
    {isOnline && (
      <span
        className="absolute -bottom-1 right-0 size-3.5 bg-green-500
        rounded-full ring-2 ring-primary animate-pulse-glow"
      />
    )}

    {/* Mobile version badges */}
    <div className="lg:hidden">
      {unreadCount > 0 ? (
        <span
          className="absolute -top-1 -right-1 bg-primary text-white text-[10px]
          px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center shadow-lg"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : (
        !isOnline &&
        lastSeenText && (
          <span
            className="absolute -bottom-1 -right-1 bg-primary text-white text-[9px]
            px-1.5 py-0.5 rounded-full font-medium"
          >
            {lastSeenText.replace(" ago", "")}
          </span>
        )
      )}
    </div>
  </div>

  {/* User info */}
  <div className="hidden lg:block text-left min-w-0 flex-1">
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

    <div className="text-sm relative">
      {isOnline ? (
        <span className="text-green-500 font-medium">● Active now</span>
      ) : (
        <span className="text-secondary">
          {lastSeenText || "Offline"}
        </span>
      )}
    </div>
  </div>
</button>


          );
        })}

        {sortedUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4 text-sm lg:text-base">
            No {showOnlineOnly ? "Online" : ""} Users
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;