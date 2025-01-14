export const getTimeIn12HourFormat = (date: Date) => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const getHoursDifference = (
  date1: Date | string,
  date2: Date | string
) => {
  const diff = new Date(date2).valueOf() - new Date(date1).valueOf();
  const diffInHours = diff / (1000 * 60 * 60);
  return diffInHours;
};

export const getDaysDifference = (
  date1: Date | string,
  date2: Date | string
) => {
  const diff = new Date(date2).valueOf() - new Date(date1).valueOf();
  const diffDays = diff / (1000 * 60 * 60 * 24);
  return diffDays;
};
