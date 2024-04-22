import { Key, useContext } from "react";
import { SimpleTableCell } from "./SimpleTableCell";
import { SimpleTableContext } from "./SimpleTableContext";

interface iSimpleTableRowProps {
  rowId: Key;
  rowNumber: number;
}

export const SimpleTableRow = ({ rowId, rowNumber }: iSimpleTableRowProps): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <tr
      id={`${simpleTableContext.id}-row-${rowId}`}
      className={`simpletable-bodyrow${
        (simpleTableContext.currentSelection?.findIndex((s) => s === rowId) ?? -1) > -1
          ? " selected"
          : ""
      }`}
    >
      {simpleTableContext.selectable && (
        <td
          className="simpletable-firstcol"
          style={{
            backgroundColor: simpleTableContext.headerBackgroundColor,
          }}
        >
          <div className="simpletable-header-text">
            <input
              id={`${simpleTableContext.id}-check-row-${rowId}`}
              role="checkbox"
              type="checkbox"
              className={simpleTableContext.filterCheckClassName}
              checked={
                (simpleTableContext.currentSelection?.findIndex((s) => s === rowId) ?? -1) > -1
              }
              onChange={() =>
                simpleTableContext.toggleSelection && simpleTableContext.toggleSelection(rowId)
              }
            />
          </div>
        </td>
      )}
      {simpleTableContext.fields
        .filter((f) => !f.hidden)
        .map((field, ci) => (
          <SimpleTableCell
            key={ci}
            rowId={rowId}
            rowNumber={rowNumber}
            columnNumber={ci}
            cellField={field.name}
          />
        ))}
    </tr>
  );
};

SimpleTableRow.displayName = "SimpleTableRow";
