import { Key, useContext } from 'react';
import { SimpleTableCell } from './SimpleTableCell';
import { SimpleTableContext } from './SimpleTableContext';

interface iSimpleTableRowProps {
  rowId: Key;
}

export const SimpleTableRow = ({ rowId }: iSimpleTableRowProps): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <tr id={`${simpleTableContext.id}-row-${rowId}`}>
      {simpleTableContext.selectable && (
        <td
          className='simpletable-firstcol'
          style={{ backgroundColor: simpleTableContext.firstColumnBackgroundColor }}
        >
          <input
            id={`${simpleTableContext.id}-check-row-${rowId}`}
            role='checkbox'
            type='checkbox'
            className={simpleTableContext.filterCheckClassName}
            checked={
              (simpleTableContext.currentSelection?.findIndex((s) => s === rowId) ?? -1) > -1
            }
            onChange={() =>
              simpleTableContext.toggleSelection && simpleTableContext.toggleSelection(rowId)
            }
          />
        </td>
      )}
      {simpleTableContext.fields
        .filter((f) => !f.hidden)
        .map((field, ci) => (
          <SimpleTableCell
            key={ci}
            rowId={rowId}
            columnNumber={ci}
            cellField={field.name}
          />
        ))}
    </tr>
  );
};
