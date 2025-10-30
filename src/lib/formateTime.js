// Format time in 12-hour format
export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Get relative time with beautiful formatting
export function getRelativeTime(date) {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor((now - messageDate) / 1000);

  // Less than 1 minute
  if (diffInSeconds < 60) {
    return "Just now";
  }

  // Less than 1 hour → show minutes ago
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
  }

  // Check if message was yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (
    messageDate.getDate() === yesterday.getDate() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday at ${formatMessageTime(messageDate)}`;
  }

  // More than 1 hour but today → show time only
  if (diffInSeconds < 86400) {
    return formatMessageTime(messageDate);
  }

  // Less than 7 days - show day name with time (e.g., "Fri at 10:58 PM")
  if (diffInSeconds < 604800) {
    const dayName = messageDate.toLocaleDateString("en-US", {
      weekday: "short",
    });
    return `${dayName} at ${formatMessageTime(messageDate)}`;
  }

  // More than 7 days - show full date with time (e.g., "Oct 28, 2024 at 10:58 AM")
  const fullDate = messageDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${fullDate} at ${formatMessageTime(messageDate)}`;
}
