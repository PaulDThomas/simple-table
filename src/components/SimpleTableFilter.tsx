import { useContext } from 'react';
import { SimpleTableContext } from './SimpleTableContext';

export const SimpleTableFilter = (): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <div
      className='simpletable-filter-holder'
      onClick={() =>
        simpleTableContext.setFilterData &&
        simpleTableContext.setFilterData(!simpleTableContext.filterData)
      }
    >
      <input
        id={`${simpleTableContext.id}-filter`}
        type='checkbox'
        role='checkbox'
        className={simpleTableContext.filterCheckClassName}
        checked={
          simpleTableContext.filterData !== undefined ? simpleTableContext.filterData : false
        }
        onChange={() => true}
        aria-labelledby={`${simpleTableContext.id}-filter-label`}
      />
      <span
        id={`${simpleTableContext.id}-filter-label`}
        className='simpletable-filter-label'
      >
        {simpleTableContext.filterLabel ?? 'Filter'}
      </span>
    </div>
  );
};
