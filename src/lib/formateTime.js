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

  // Less than 1 hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
  }

  // Less than 24 hours (1 day)
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  // Less than 7 days - show day name with time (e.g., "Fri at 10:58 PM")
  if (diffInSeconds < 604800) {
    const dayName = messageDate.toLocaleDateString("en-US", {
      weekday: "short",
    });
    const time = messageDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dayName} at ${time}`;
  }

  // More than 7 days - show full date with time (e.g., "Oct 28, 2024 at 10:58 AM")
  const fullDate = messageDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = messageDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${fullDate} at ${time}`;
}
