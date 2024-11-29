export default function excludeKey<T, K extends keyof T>(
  obj: T,
  key: K
): Omit<T, K> {
  const { [key]: _, ...rest } = obj;
  return rest;
}

export const formatDateToAMPM = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(date).toLocaleString("en-US", options);
};
