import React from "react";
import { ISimpleTableCellRenderProps } from "../components";
import styles from "../components/SimpleTableCell.module.css";

export const convertDateToLocaleString = (s: string | Date): string => {
  const d = s instanceof Date ? s : new Date(s);
  return !isNaN(d.getTime())
    ? `${new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
        .replace(/[T]/, " ")}`
    : "Invalid date";
};

export const convertLocaleDateToUTCString = (s: string): string => {
  const d = new Date(s);
  return d instanceof Date && !isNaN(d.getTime())
    ? `${new Date(d.getTime()).toISOString()}`
    : "Invalid date";
};

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

export const simpleTableNullDate = ({
  rowData,
  cellField,
}: ISimpleTableCellRenderProps): React.JSX.Element => (
  <div
    className={`simple-table-null-date-cell overflow-hidden ${typeof rowData[cellField] === "number" ? styles.textRight : styles.textLeft}`}
  >
    <span>{columnFilterValue(rowData[cellField], false)}</span>
  </div>
);
