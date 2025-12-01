export const convertLocaleDateToUTCString = (s: string): string => {
  const d = new Date(s);
  return d instanceof Date && !isNaN(d.getTime())
    ? `${new Date(d.getTime()).toISOString()}`
    : "Invalid date";
};
