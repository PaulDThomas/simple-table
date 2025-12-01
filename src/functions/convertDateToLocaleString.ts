export const convertDateToLocaleString = (s: string | Date): string => {
  const d = s instanceof Date ? s : new Date(s);
  return !isNaN(d.getTime())
    ? `${new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
        .replace(/[T]/, " ")}`
    : "Invalid date";
};
