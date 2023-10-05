import React, { useCallback, useContext, useRef } from 'react';
import { SimpleTableContext } from './SimpleTableContext';
import { SimpleTableHeaderContents } from './SimpleTableHeaderContents';

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
    if (targetCell.current) {
      const ix = parseInt(targetCell.current.dataset.key ?? '-1');
      const width = targetCell.current.style.width;
      simpleTableContext &&
        simpleTableContext.setColumnWidth &&
        width &&
        simpleTableContext.setColumnWidth(ix, targetCell.current.style.width);
      targetCell.current = null;
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    }
  }, [mouseMove, simpleTableContext]);

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
              data-key={hi}
              className={'simpletable-header'}
              style={{
                backgroundColor: simpleTableContext.headerBackgroundColor,
                opacity: 1,
                width: simpleTableContext.columnWidths[hi] ?? '100px',
              }}
            >
              {field.headerRenderFn ? (
                <div className='simpletable-header-text'>
                  {field.headerRenderFn({ field, columnNumber: hi })}
                </div>
              ) : (
                <SimpleTableHeaderContents
                  field={field}
                  columnNumber={hi}
                />
              )}
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

SimpleTableHeader.displayName = 'SimpleTableHeader';
