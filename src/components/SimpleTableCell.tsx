import { useContext, useMemo } from 'react';
import { iSimpleTableField, iSimpleTableRow } from './interface';
import { SimpleTableContext } from './SimpleTableContext';

interface iSimpleTableCellProps {
  rowId: string | number;
  columnNumber: number;
  cellField: string;
}

export const SimpleTableCell = ({
  rowId,
  cellField,
  columnNumber,
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
      className={`${columnNumber === 0 && 'simpletable-firstcol'} simpletable-cell`}
      style={{
        backgroundColor:
          columnNumber === 0 ? simpleTableContext.firstColumnBackgroundColor : undefined,
      }}
    >
      <div>
        {!field || !rowData
          ? `${!rowData ? 'Row data' : ''}${!rowData && !field ? ', ' : ''}${
              !field ? 'Field' : ''
            } not found`
          : field.renderFn
          ? field.renderFn({ rowData, columnNumber, cellField: field.name })
          : String(rowData[field.name])}
      </div>
    </td>
  );
};
