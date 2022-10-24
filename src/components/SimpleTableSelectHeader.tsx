import { useContext, useEffect, useRef } from 'react';
import { SimpleTableContext } from './SimpleTableContext';

export const SimpleTableSelectHeader = (): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);
  const allCheck = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (allCheck.current) {
      if (simpleTableContext.currentSelection?.length === simpleTableContext.tableData.length) {
        allCheck.current.checked = true;
        allCheck.current.indeterminate = false;
      } else if ((simpleTableContext.currentSelection?.length ?? 0) === 0) {
        allCheck.current.checked = false;
        allCheck.current.indeterminate = false;
      } else {
        allCheck.current.checked = false;
        allCheck.current.indeterminate = true;
      }
    }
  }, [simpleTableContext.currentSelection?.length, simpleTableContext.tableData.length]);

  return (
    <th
      className='simpletable-box-header'
      style={{
        backgroundColor: simpleTableContext.headerBackgroundColor,
        opacity: 1,
      }}
    >
      <input
        id={`${simpleTableContext.id}-check-all`}
        type='checkbox'
        role='checkbox'
        ref={allCheck}
        onChange={() => {
          simpleTableContext.toggleAllCurrentSelection &&
            simpleTableContext.toggleAllCurrentSelection();
        }}
      />
    </th>
  );
};
