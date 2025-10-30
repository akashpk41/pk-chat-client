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
  const totalUnread = Object.values(unreadMessages || {}).reduce(
    (sum, count) => sum + count,
    0
  );

  if (isUserLoading) return <SidebarSkeleton />;

  return (
   <aside className="h-full w-20 md:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100">
  {/* Header */}
  <div className="border-b border-base-300 w-full p-4 bg-gradient-to-br from-base-100 to-base-200">
    {/* Mobile Layout */}
    <div className="md:hidden flex flex-col items-center gap-2">
      <div className="relative">
        <div className="p-2 rounded-xl bg-primary/10">
          <Users className="w-6 h-6 text-primary" />
        </div>
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center shadow-lg animate-pulse">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </div>
      <span className="text-xs font-semibold text-base-content/60">
        ({onlineUsers.length - 1})
      </span>

      {/* Filter Toggle for Mobile */}
      <label className="cursor-pointer flex flex-col items-center gap-1 group">
        <input
          type="checkbox"
          checked={showOnlineOnly}
          onChange={(e) => setShowOnlineOnly(e.target.checked)}
          className="checkbox checkbox-sm checkbox-primary"
        />
        <span className="text-[10px] font-medium text-base-content/60 group-hover:text-primary transition-colors">
          Filter
        </span>
      </label>
    </div>

    {/* Desktop Layout */}
    <div className="hidden md:block">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg text-base-content">Contacts</span>
        </div>
        {/* Total unread badge */}
        {totalUnread > 0 && (
          <div className="min-w-[28px] h-7 px-2 bg-primary text-primary-content rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-xs font-bold">
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          </div>
        )}
      </div>

      {/* Online filter toggle */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors">
        <label className="cursor-pointer flex items-center gap-2 flex-1">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm checkbox-primary"
          />
          <span className="text-sm font-medium text-base-content">Show online only</span>
        </label>
        <span className="text-xs font-semibold text-primary px-2 py-1 bg-primary/10 rounded-full">
          {onlineUsers.length - 1} online
        </span>
      </div>
    </div>
  </div>

  <div className="overflow-y-auto w-full py-2">
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
            w-full p-3 flex cursor-pointer items-center gap-3
            transition-all duration-200
            ${
              isSelected
                ? "bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 border-l-4 border-primary shadow-lg"
                : "hover:bg-base-200 border-l-4 border-transparent"
            }
          `}
        >
          <div className="relative mx-auto md:mx-0">
            {/* Avatar with premium gradient ring */}
            <div
              className={`
                w-12 h-12 rounded-full overflow-hidden relative transition-all duration-300
                ${unreadCount > 0 ? "ring-2 ring-primary shadow-lg shadow-primary/30" : ""}
                ${
                  isSelected
                    ? "ring-4 ring-primary shadow-xl shadow-primary/40 scale-110"
                    : ""
                }
              `}
            >
              <img
                src={user.profilePic || "/avatar3.png"}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Online status with blink effect */}
            {isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ring-2 ring-base-100 bg-green-500 shadow-lg">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
              </span>
            )}

            {/* Mobile version badges */}
            <div className="md:hidden">
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center shadow-lg animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : (
                !isOnline &&
                lastSeenText && (
                  <span className="absolute -bottom-1 -right-1 bg-base-content text-base-100 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                    {lastSeenText.replace(" ago", "")}
                  </span>
                )
              )}
            </div>
          </div>

          {/* User info */}
          <div className="hidden md:block text-left min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className={`truncate ${
                    unreadCount > 0
                      ? "font-bold text-base-content"
                      : "font-semibold text-base-content"
                  }`}
                >
                  {user.fullName}
                </span>
                {/* Premium Verify Badge */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="drop-shadow-md flex-shrink-0"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="11"
                    fill={`url(#userVerify-${user._id})`}
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
                      id={`userVerify-${user._id}`}
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

              {/* Desktop: Unread count badge */}
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-content text-xs px-2 py-1 rounded-full font-bold min-w-[24px] text-center flex-shrink-0 shadow-lg animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>

            <div className="text-sm relative">
              {isOnline ? (
                <span className="text-success font-semibold flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  Active now
                </span>
              ) : (
                <span className="text-base-content/60 font-medium text-xs">
                  Active {lastSeenText || "Offline"}
                </span>
              )}
            </div>
          </div>
        </button>
      );
    })}

    {sortedUsers.length === 0 && (
      <div className="text-center py-8 px-4">
        <div className="text-base-content/60 font-medium text-sm">
          No {showOnlineOnly ? "Online" : ""} Users
        </div>
      </div>
    )}
  </div>
</aside>
  );
};

export default Sidebar;
