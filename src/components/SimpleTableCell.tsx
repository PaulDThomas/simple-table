import { Key, useContext, useMemo } from "react";
import { iSimpleTableField, iSimpleTableRow } from "./interface";
import { SimpleTableContext } from "./SimpleTableContext";

interface iSimpleTableCellProps {
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
}: iSimpleTableCellProps): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);

  const field: iSimpleTableField | undefined = useMemo(
    () => simpleTableContext.fields.find((f) => f.name === cellField),
    [cellField, simpleTableContext.fields],
  );

  const rowData: iSimpleTableRow | undefined = useMemo(
    () => simpleTableContext.viewData.find((d) => d[simpleTableContext.keyField] === rowId),
    [rowId, simpleTableContext.keyField, simpleTableContext.viewData],
  );

  return (
    <td
      id={`${simpleTableContext.id}-row-${String(rowId).toLowerCase().trim()}-cell-${
        field?.name ?? columnNumber
      }`}
      key={cellField}
      className={"simpletable-cell"}
    >
      <div>
        {!field || !rowData
          ? `${!rowData ? "Row data" : ""}${!rowData && !field ? ", " : ""}${
              !field ? "Field" : ""
            } not found`
          : field.renderFn
          ? field.renderFn({ rowData, columnNumber, field, cellField: field.name, rowNumber })
          : String(rowData[field.name])}
      </div>
    </td>
  );
};

SimpleTableCell.displayName = "SimpleTableCell";
