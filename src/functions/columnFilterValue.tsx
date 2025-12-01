import { convertDateToLocaleString } from "./convertDateToLocaleString";

export const columnFilterValue = (dataItem: unknown, showBlank = true): string => {
  if (
    !showBlank &&
    (dataItem === null ||
      dataItem === undefined ||
      (typeof dataItem === "string" && dataItem.trim() === ""))
  ) {
    return "";
  }
  switch (typeof dataItem) {
    case "number":
    case "boolean":
    case "bigint":
      return `${dataItem}`;
    case "string":
      return dataItem.trim() === ""
        ? "<blank>"
        : dataItem.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/)
          ? convertDateToLocaleString(new Date(dataItem))
          : dataItem;
    case "object":
      if (dataItem === null) {
        return "<blank>";
      }
      if (Array.isArray(dataItem)) {
        return "📃📃";
      }
      if (dataItem instanceof Date) {
        return convertDateToLocaleString(dataItem);
      }
      return "📦📦";
    case "function":
      return "🛠️🛠️";
    // Only undefined and Symbol are left
    default:
      return dataItem === undefined ? "<blank>" : "⁉️⁉️";
  }
};
