import type { ISimpleTableColumnFilterValueFn } from "components";
import { convertDateToLocaleString } from "./convertDateToLocaleString";

export const columnFilterValue = (
  dataItem: unknown,
  showBlank = true,
  customFilterValueFn?: ISimpleTableColumnFilterValueFn,
): string[] => {
  if (customFilterValueFn) {
    return customFilterValueFn(dataItem);
  }
  if (
    !showBlank &&
    (dataItem === null ||
      dataItem === undefined ||
      (typeof dataItem === "string" && dataItem.trim() === ""))
  ) {
    return [""];
  }
  switch (typeof dataItem) {
    case "number":
    case "boolean":
    case "bigint":
      return [`${dataItem}`];
    case "string":
      return dataItem.trim() === ""
        ? ["<blank>"]
        : dataItem.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/)
          ? [convertDateToLocaleString(new Date(dataItem))]
          : [dataItem];
    case "object":
      if (dataItem === null) {
        return ["<blank>"];
      }
      if (Array.isArray(dataItem)) {
        return dataItem.flatMap((item) => columnFilterValue(item, showBlank));
      }
      if (dataItem instanceof Date) {
        return [convertDateToLocaleString(dataItem)];
      }
      return Object.values(dataItem).flatMap((item) => columnFilterValue(item, showBlank));
    case "function":
      return ["🛠️🛠️"];
    // Only undefined and Symbol are left
    default:
      return dataItem === undefined ? ["<blank>"] : ["⁉️⁉️"];
  }
};
