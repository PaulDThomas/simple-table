import { Key, useContext } from "react";
import { SimpleTableCell } from "./SimpleTableCell";
import { SimpleTableContext } from "./SimpleTableContext";
import styles from "./SimpleTableRow.module.css";

interface SimpleTableRowProps {
  rowId: Key;
  rowNumber: number;
}

export const SimpleTableRow = ({ rowId, rowNumber }: SimpleTableRowProps): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <tr
      id={`${simpleTableContext.id}-row-${rowId}`}
      className={
        (simpleTableContext.currentSelection?.findIndex((s) => s === rowId) ?? -1) > -1
          ? styles.selected
          : undefined
      }
    >
      {simpleTableContext.selectable && (
        <td className={styles.firstcol}>
          <div>
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
