import { useContext } from 'react';
import { SimpleTableContext } from './SimpleTableContext';

export const SimpleTablePager = (): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <div className='simpletable-footer'>
      <span>
        Showing&nbsp;
        <select
          aria-label='Visible rows'
          value={`${
            simpleTableContext.pageRows === Infinity ? 'All' : simpleTableContext.pageRows
          }`}
          onChange={(e) =>
            simpleTableContext.setPageRows &&
            simpleTableContext.setPageRows(
              e.currentTarget.value === 'All' ? Infinity : parseInt(e.currentTarget.value),
            )
          }
        >
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
          <option>250</option>
          <option>500</option>
          <option>All</option>
        </select>
        &nbsp;of&nbsp;{simpleTableContext.viewData.length}&nbsp;rows
        {simpleTableContext.viewData.length !== simpleTableContext.totalRows &&
          ` (${simpleTableContext.totalRows} unfiltered)`}
        &nbsp;from&nbsp;
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='12'
          fill='currentColor'
          viewBox='0 0 16 16'
          aria-label='Go to first page'
          onClick={() => simpleTableContext.setFirstRow && simpleTableContext.setFirstRow(0)}
        >
          <path d='M8.404 7.304a.802.802 0 0 0 0 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V4.308c0-.653-.713-.998-1.233-.696L8.404 7.304Z' />
          <path d='M.404 7.304a.802.802 0 0 0 0 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V4.308c0-.653-.713-.998-1.233-.696L.404 7.304Z' />
        </svg>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='12'
          fill='currentColor'
          viewBox='0 0 16 16'
          aria-label='Go to previous page'
          onClick={() =>
            simpleTableContext.setFirstRow &&
            simpleTableContext.setFirstRow(
              Math.max(0, simpleTableContext.firstRow - simpleTableContext.pageRows),
            )
          }
        >
          <path d='m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z' />
        </svg>
        row&nbsp;
        <select
          aria-label='First row'
          value={simpleTableContext.firstRow}
          onChange={(e) => {
            simpleTableContext.setFirstRow &&
              simpleTableContext.setFirstRow(parseInt(e.currentTarget.value));
          }}
        >
          {simpleTableContext.pageRows === Infinity ? (
            <option>1</option>
          ) : (
            Array.from(
              {
                length: Math.ceil(simpleTableContext.viewData.length / simpleTableContext.pageRows),
              },
              (_, i) => i * simpleTableContext.pageRows,
            ).map((rn) => (
              <option
                key={rn}
                value={rn}
              >
                {rn + 1}
              </option>
            ))
          )}
        </select>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='12'
          fill='currentColor'
          viewBox='0 0 16 16'
          aria-label='Go to next page'
          onClick={() =>
            simpleTableContext.setFirstRow &&
            simpleTableContext.firstRow + simpleTableContext.pageRows <
              simpleTableContext.viewData.length &&
            simpleTableContext.setFirstRow(
              simpleTableContext.firstRow + simpleTableContext.pageRows,
            )
          }
        >
          <path d='m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z' />
        </svg>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='12'
          fill='currentColor'
          viewBox='0 0 16 16'
          aria-label='Go to last page'
          onClick={() => {
            simpleTableContext.setFirstRow &&
              simpleTableContext.setFirstRow(
                Math.floor((simpleTableContext.viewData.length - 1) / simpleTableContext.pageRows) *
                  simpleTableContext.pageRows,
              );
          }}
        >
          <path d='M7.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692Z' />
          <path d='M15.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692Z' />
        </svg>
      </span>
    </div>
  );
};
