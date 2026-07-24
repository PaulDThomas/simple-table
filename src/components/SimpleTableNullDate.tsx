import React from "react";
import { ISimpleTableCellRenderFn, ISimpleTableCellRenderProps } from ".";
import { columnFilterValue } from "../functions/columnFilterValue";
import styles from "./SimpleTableCell.module.css";

export const SimpleTableNullDate: ISimpleTableCellRenderFn = ({
  rowData,
  cellField,
  field,
}: ISimpleTableCellRenderProps): React.ReactElement => (
  <div
    className={[
      `simple-table-null-date-cell`,
      styles.overflowHidden,
      typeof rowData[cellField] === "number" ? styles.textRight : styles.textLeft,
    ].join(" ")}
  >
    <span>{columnFilterValue(rowData[cellField], false, field.columnFilterValueFn)}</span>
  </div>
);
