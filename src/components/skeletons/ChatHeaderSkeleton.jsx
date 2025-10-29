import React from "react";

const ChatHeaderSkeleton = () => {
  return (
    <div className="p-2.5 border-b border-base-300 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar Skeleton */}
          <div className="avatar">
            <div className="size-10 rounded-full bg-base-300"></div>
          </div>

          {/* Name + Status */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-base-300 rounded"></div>
            <div className="h-3 w-20 bg-base-300 rounded"></div>
          </div>
        </div>

        {/* Close Button Placeholder */}
        <div className="size-6 bg-base-300 rounded"></div>
      </div>
    </div>
  );
};

export default ChatHeaderSkeleton;
