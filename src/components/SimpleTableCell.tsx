import { createElement, Key, useContext, type ReactElement } from "react";
import { ISimpleTableField, ISimpleTableRow } from "./interface";
import styles from "./SimpleTableCell.module.css";
import { SimpleTableContext } from "./SimpleTableContext";
import { SimpleTableNullDate } from "./SimpleTableNullDate";

interface SimpleTableCellProps {
  rowId: Key;
  cellField: string;
  columnNumber: number;
  rowNumber: number;
}

export const SimpleTableCell = ({
  rowId,
  cellField,
  columnNumber,
  rowNumber,
}: SimpleTableCellProps): ReactElement => {
  const simpleTableContext = useContext(SimpleTableContext);

  const field: ISimpleTableField | undefined = simpleTableContext.fields.find(
    (f) => f.name === cellField,
  );

  const rowData: ISimpleTableRow | undefined = simpleTableContext.viewData.find(
    (d) => d[simpleTableContext.keyField] === rowId,
  );

  return (
    <td
      id={`${simpleTableContext.id}-row-${String(rowId).toLowerCase().trim()}-cell-${
        field?.name ?? columnNumber
      }`}
      key={cellField}
      className={styles.cell}
    >
      {!field || !rowData ? (
        <>{`${!rowData ? "Row data" : ""}${!rowData && !field ? ", " : ""}${
          !field ? "Field" : ""
        } not found`}</>
      ) : (
        createElement(field.renderFn ?? SimpleTableNullDate, {
          rowData,
          columnNumber,
          field,
          cellField: field.name,
          rowNumber,
        })
      )}
    </td>
  );
};

SimpleTableCell.displayName = "SimpleTableCell";
