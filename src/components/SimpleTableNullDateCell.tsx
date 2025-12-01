import React from "react";
import { ISimpleTableCellRenderProps } from ".";
import styles from "../components/SimpleTableCell.module.css";
import { columnFilterValue } from "../functions/columnFilterValue";

export const SimpleTableNullDateCell = ({
  rowData,
  cellField,
}: ISimpleTableCellRenderProps): React.ReactElement => (
  <div
    className={`simple-table-null-date-cell overflow-hidden ${typeof rowData[cellField] === "number" ? styles.textRight : styles.textLeft}`}
  >
    <span>{columnFilterValue(rowData[cellField], false)}</span>
  </div>
);
