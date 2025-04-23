import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SimpleTableContext, ISimpleTableColumnFilter } from "./SimpleTableContext";
import styles from "./SimpleTableColumnFilter.module.css";
import cbStyles from "./SimpleTableCheckBox.module.css";
import { CloseSvg } from "./Svgs";

export const SimpleTableColumnFilter = ({ columnName }: { columnName: string }) => {
  const simpleTableContext = useContext(SimpleTableContext);
  const allCheck = useRef<HTMLInputElement | null>(null);
  const [localFilter, setLocalFilter] = useState<string>("");
  const searchCheck = useRef<HTMLInputElement | null>(null);

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
        const newColumnFilter: ISimpleTableColumnFilter = {
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

  // Toggle all viewed rows
  const toggleCurrentColumnSearchFilter = useCallback(() => {
    if (availableList) {
      const searchedItems =
        availableList.filter((v) => v.toLowerCase().includes(localFilter.toLowerCase())) ?? [];
      // First item selected, remove all items from the current filter
      if (currentFilter.includes(searchedItems[0]))
        updateCurrentFilter(currentFilter.filter((v) => !searchedItems.includes(v)));
      else
        updateCurrentFilter([
          ...searchedItems,
          ...currentFilter.filter((v) => !searchedItems.includes(v)),
        ]);
    }
  }, [availableList, currentFilter, localFilter, updateCurrentFilter]);

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
    if (searchCheck.current) {
      const searchResults = availableList?.filter((v) =>
        v.toLowerCase().includes(localFilter.toLowerCase()),
      );
      if (
        localFilter.trim().length === 0 ||
        searchResults?.length === 0 ||
        !searchResults?.some((v) => currentFilter.includes(v))
      ) {
        searchCheck.current.checked = false;
        searchCheck.current.indeterminate = false;
      } else if (searchResults?.every((v) => currentFilter.includes(v))) {
        searchCheck.current.checked = true;
        searchCheck.current.indeterminate = false;
      } else {
        searchCheck.current.checked = false;
        searchCheck.current.indeterminate = true;
      }
    }
  }, [availableList, availableList?.length, currentFilter, currentFilter?.length, localFilter]);

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>
              <div className={styles.search}>
                <input
                  id={`${simpleTableContext.id}-columnfilter-${columnName}-filter`}
                  aria-label="Column filter search"
                  value={localFilter}
                  onChange={(e) => setLocalFilter(e.currentTarget.value)}
                />
                <div className={styles.close}>
                  <CloseSvg
                    onClick={() =>
                      simpleTableContext.setCurrentColumnFilter &&
                      simpleTableContext.setCurrentColumnFilter(null)
                    }
                  />
                </div>
              </div>
            </th>
          </tr>
          {localFilter.trim().length > 0 && (
            <tr>
              <td className={styles.boxHeader}>
                <div
                  className={cbStyles.checkboxContainer}
                  onClick={() => {
                    toggleCurrentColumnSearchFilter();
                  }}
                >
                  <input
                    id={`${simpleTableContext.id}-columnsearchfilter-${columnName}-check-all`}
                    aria-label="Column search filter toggle"
                    className={simpleTableContext.filterCheckClassName}
                    ref={searchCheck}
                    type="checkbox"
                    role="checkbox"
                  />
                </div>
              </td>
              <td>Toggle selection</td>
            </tr>
          )}
          <tr>
            <th className={styles.boxHeader}>
              <div
                className={cbStyles.checkboxContainer}
                onClick={() => toggleCurrentColumnFilter()}
              >
                <input
                  id={`${simpleTableContext.id}-columnfilter-${columnName}-check-all`}
                  aria-label="Column filter toggle"
                  className={simpleTableContext.filterCheckClassName}
                  ref={allCheck}
                  type="checkbox"
                  role="checkbox"
                />
              </div>
            </th>
            <th>Select all</th>
          </tr>
        </thead>

        <tbody className={styles.scroll}>
          {availableList &&
            availableList
              .filter((v) => v.toLowerCase().includes(localFilter.toLowerCase()))
              .map((v, i) => (
                <tr key={i}>
                  <td>
                    <div
                      className={cbStyles.checkboxContainer}
                      onClick={() => {
                        const newFilter = [...currentFilter];
                        const ix = newFilter.findIndex((cf) => cf === v);
                        if (ix > -1) {
                          newFilter.splice(ix, 1);
                        } else {
                          newFilter.push(v);
                        }
                        updateCurrentFilter(newFilter);
                      }}
                    >
                      <input
                        id={`${simpleTableContext.id}-columnfilter-${columnName}-check-${i}`}
                        type="checkbox"
                        role="checkbox"
                        aria-label={v}
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
                    </div>
                  </td>
                  <td>{v}</td>
                </tr>
              ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>
              <small>
                {currentFilter.length} item{currentFilter.length !== 1 ? "s" : ""} selected
              </small>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

SimpleTableColumnFilter.displayName = "SimpleTableColumnFilter";
