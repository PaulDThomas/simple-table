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

export const simpleTableNullDate = ({
  rowData,
  cellField,
}: ISimpleTableCellRenderProps): JSX.Element => (
  <div
    className={`simple-table-null-date-cell overflow-hidden ${typeof rowData[cellField] === "number" ? styles.textRight : styles.textLeft}`}
  >
    {rowData[cellField] instanceof Date ? (
      `${new Date(
        (rowData[cellField] as Date).getTime() -
          (rowData[cellField] as Date).getTimezoneOffset() * 60000,
      )
        .toISOString()
        .replace(/T/, " ")
        .slice(0, 16)}`
    ) : typeof rowData[cellField] === "object" && rowData[cellField] ? (
      <pre>{JSON.stringify(rowData[cellField], null, 2)}</pre>
    ) : (
      <span>{`${rowData[cellField] ?? ""}`}</span>
    )}
  </div>
);
