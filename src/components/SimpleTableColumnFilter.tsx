import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SimpleTableContext, iSimpleTableColumnFilter } from './SimpleTableContext';

export const SimpleTableColumnFilter = ({ columnName }: { columnName: string }) => {
  const simpleTableContext = useContext(SimpleTableContext);
  const allCheck = useRef<HTMLInputElement | null>(null);
  const [localFilter, setLocalFilter] = useState<string>('');

  const availableList = useMemo(() => {
    return simpleTableContext.currentColumnItems
      .find((cf) => cf.columnName === columnName)
      ?.values.sort((a, b) => a.localeCompare(b));
  }, [columnName, simpleTableContext]);

  const currentFilter = useMemo(() => {
    const ret = simpleTableContext.currentColumnFilters?.find((cf) => cf.columnName === columnName);
    return ret?.values ?? [];
  }, [columnName, simpleTableContext.currentColumnFilters]);

  const updateCurrentFilter = useCallback(
    (values: string[]) => {
      if (simpleTableContext && simpleTableContext.setCurrentColumnFilters) {
        const newColumnFilters = [...simpleTableContext.currentColumnFilters];
        const newColumnFilter: iSimpleTableColumnFilter = {
          columnName,
          values,
        };
        const ix = simpleTableContext.currentColumnFilters.findIndex(
          (cf) => cf.columnName === columnName,
        );
        if (ix > -1) {
          newColumnFilters.splice(ix, 1, newColumnFilter);
        } else {
          newColumnFilters.push(newColumnFilter);
        }
        simpleTableContext.setCurrentColumnFilters(newColumnFilters);
      }
    },
    [columnName, simpleTableContext],
  );

  // Toggle all viewed rows
  const toggleCurrentColumnFilter = useCallback(() => {
    if (currentFilter.length > 0) {
      updateCurrentFilter([]);
    } else if (availableList) {
      updateCurrentFilter(availableList);
    }
  }, [availableList, currentFilter.length, updateCurrentFilter]);

  useEffect(() => {
    if (allCheck.current) {
      if (currentFilter?.length === availableList?.length) {
        allCheck.current.checked = true;
        allCheck.current.indeterminate = false;
      } else if ((currentFilter?.length ?? 0) === 0) {
        allCheck.current.checked = false;
        allCheck.current.indeterminate = false;
      } else {
        allCheck.current.checked = false;
        allCheck.current.indeterminate = true;
      }
    }
  }, [availableList?.length, currentFilter?.length]);

  return (
    <>
      <table className='columnfilter-table'>
        <thead>
          <tr>
            <td>&nbsp;</td>
            <td>
              <input
                id={`${simpleTableContext.id}-columnfilter-${columnName}-filter`}
                value={localFilter}
                onChange={(e) => setLocalFilter(e.currentTarget.value)}
                style={{ width: 'calc(100% - 8px)' }}
              />
            </td>
          </tr>
          <tr>
            <td
              className='columnfilter-box-header'
              style={{
                backgroundColor: simpleTableContext.headerBackgroundColor,
                opacity: 1,
              }}
            >
              <input
                id={`${simpleTableContext.id}-columnfilter-${columnName}-check-all`}
                ref={allCheck}
                type='checkbox'
                role='checkbox'
                onChange={() => toggleCurrentColumnFilter()}
              />
            </td>
            <td>Select all</td>
          </tr>
        </thead>

        <tbody className='small-scrollbar'>
          {availableList &&
            availableList
              .filter((v) => v.toLowerCase().includes(localFilter.toLowerCase()))
              .map((v, i) => (
                <tr key={i}>
                  <td>
                    <input
                      id={`${simpleTableContext.id}-check-all`}
                      type='checkbox'
                      role='checkbox'
                      className={simpleTableContext.filterCheckClassName}
                      checked={currentFilter.includes(v)}
                      onChange={() => {
                        const newFilter = [...currentFilter];
                        const ix = newFilter.findIndex((cf) => cf === v);
                        if (ix > -1) {
                          newFilter.splice(ix, 1);
                        } else {
                          newFilter.push(v);
                        }
                        updateCurrentFilter(newFilter);
                      }}
                    />
                  </td>
                  <td>{v}</td>
                </tr>
              ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>
              {currentFilter.length} item{currentFilter.length !== 1 ? 's' : ''} selected
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};