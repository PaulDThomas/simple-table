import React from "react";
import { ISimpleTableCellRenderProps } from ".";
import styles from "../components/SimpleTableCell.module.css";
import { columnFilterValue } from "../functions/columnFilterValue";

export const SimpleTableNullDate = ({
  rowData,
  cellField,
}: ISimpleTableCellRenderProps): React.ReactElement => (
  <div
    className={[
      `simple-table-null-date-cell`,
      styles.overflowHidden,
      typeof rowData[cellField] === "number" ? styles.textRight : styles.textLeft,
    ].join(" ")}
  >
    <span>{columnFilterValue(rowData[cellField], false)}</span>
  </div>
);
