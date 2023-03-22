import React, { useCallback, useContext, useRef } from 'react';
import { SimpleTableContext } from './SimpleTableContext';

export const SimpleTableHeader = (): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);
  const targetCell = useRef<HTMLTableCellElement | null>(null);

  const mouseMove = useCallback((e: MouseEvent) => {
    if (targetCell.current !== null) {
      const t = targetCell.current as HTMLTableCellElement;
      const width = e.clientX - window.scrollX - t.getBoundingClientRect().x;
      if (width > 16) {
        t.style.width = `${width}px`;
      }
    }
  }, []);

  const mouseUp = useCallback(() => {
    targetCell.current = null;
    window.removeEventListener('mousemove', mouseMove);
    window.removeEventListener('mouseup', mouseUp);
  }, [mouseMove]);

  const mouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      targetCell.current = (e.currentTarget as HTMLDivElement)
        .parentElement as HTMLTableCellElement;
      if (targetCell.current) {
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
      }
    },
    [mouseMove, mouseUp],
  );

  return (
    <>
      {simpleTableContext.fields
        .filter((f) => !f.hidden)
        .map((field, hi) => {
          return (
            <th
              id={`${simpleTableContext.id}-header-${field.name}`}
              key={hi}
              className={'simpletable-header'}
              style={{
                backgroundColor: simpleTableContext.headerBackgroundColor,
                opacity: 1,
                width: field.width ?? '100px',
              }}
            >
              <span
                className='simpletable-clickable'
                onClick={() => {
                  simpleTableContext.updateSortBy && simpleTableContext.updateSortBy(field);
                }}
              >
                <span
                  className={simpleTableContext.sortBy?.name === field.name ? 'sorted' : 'unsorted'}
                >
                  {field.label}
                </span>
                {simpleTableContext.sortBy?.name === field.name ? (
                  simpleTableContext.sortBy?.asc ? (
                    <>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='currentColor'
                        viewBox='0 0 16 16'
                      >
                        <path d='M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707V12.5zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z' />
                      </svg>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='currentColor'
                        viewBox='0 0 16 16'
                      >
                        <path d='M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z' />
                      </svg>
                    </>
                  )
                ) : undefined}
              </span>
              <div
                className='resize-handle'
                onMouseDown={mouseDown}
              />
            </th>
          );
        })}
    </>
  );
};
