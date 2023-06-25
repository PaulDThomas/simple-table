import { useContext } from 'react';
import { SimpleTableContext } from './SimpleTableContext';
import { SimpleTableRow } from './SimpleTableRow';

export const SimpleTableBody = (): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <tbody>
      {simpleTableContext.viewData
        .slice(
          simpleTableContext.firstRow,
          simpleTableContext.firstRow + simpleTableContext.pageRows,
        )
        .map((row, ri) => {
          const chk =
            typeof row[simpleTableContext.keyField] === 'string' ||
            typeof row[simpleTableContext.keyField] === 'number';
          return chk ? (
            <SimpleTableRow
              key={row[simpleTableContext.keyField] as string | number}
              rowId={row[simpleTableContext.keyField] as string | number}
            />
          ) : (
            <tr key={ri}>
              <td
                colSpan={simpleTableContext.fields.filter((f) => !f.hidden ?? true).length}
                className='simpletable-cell'
              >
                keyField has not been found
              </td>
            </tr>
          );
        })}
    </tbody>
  );
};

SimpleTableBody.displayName = 'SimpleTableBody';
