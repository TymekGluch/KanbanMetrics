const MS_IN_MINUTE = 1000 * 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const formatTime = (value: number, unit: "minute" | "hour" | "day"): string => {
  return `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
};

export const getRemainingTimeOfLastUpdate = (updatedAt?: string): string => {
  if (!updatedAt) return "never";

  const now = Date.now();
  const updated = new Date(updatedAt).getTime();

  const diffInMinutes = Math.floor((now - updated) / MS_IN_MINUTE);

  if (diffInMinutes < MINUTES_IN_HOUR) {
    return formatTime(diffInMinutes, "minute");
  }

  const diffInHours = Math.floor(diffInMinutes / MINUTES_IN_HOUR);

  if (diffInHours < HOURS_IN_DAY) {
    return formatTime(diffInHours, "hour");
  }

  const diffInDays = Math.floor(diffInHours / HOURS_IN_DAY);

  return formatTime(diffInDays, "day");
};
