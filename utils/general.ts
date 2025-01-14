export const formatMinutes = (minutes: number) => {
  const minutesInHour = 60;
  const minutesInDay = 60 * 24;

  if (minutes < minutesInHour) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} before`;
  } else if (minutes < minutesInDay) {
    const hours = Math.floor(minutes / minutesInHour);
    return `${hours} hour${hours !== 1 ? "s" : ""} before`;
  } else {
    const days = Math.floor(minutes / minutesInDay);
    return `${days} day${days !== 1 ? "s" : ""} before`;
  }
};
