import { isEqual } from "lodash";
import { useContext, useEffect, useRef, useState } from "react";
import cbStyles from "./SimpleTableCheckBox.module.css";
import styles from "./SimpleTableColumnFilter.module.css";
import { ISimpleTableColumnFilter, SimpleTableContext } from "./SimpleTableContext";
import { CloseSvg } from "./Svgs";

export const SimpleTableColumnFilter = ({ columnName }: { columnName: string }) => {
  const simpleTableContext = useContext(SimpleTableContext);
  const allCheck = useRef<HTMLInputElement | null>(null);
  const searchCheck = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localFilter, setLocalFilter] = useState<string>("");
  const matchCheck = useRef<HTMLInputElement | null>(null);
  const [matchSearch, setMatchSearch] = useState<boolean>(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const availableList =
    simpleTableContext.currentColumnItems
      .find((cf) => cf.columnName === columnName)
      ?.values.sort((a, b) => a.localeCompare(b)) ?? [];

  const [currentFilter, setCurrentFilter] = useState<string[]>(
    simpleTableContext.currentColumnFilters?.find((cf) => cf.columnName === columnName)?.values ??
      availableList,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onClose = (values?: string[]) => {
    // istanbul ignore else
    if (simpleTableContext.setCurrentColumnFilters) {
      const newColumnFilters = [...simpleTableContext.currentColumnFilters];
      const newColumnFilter: ISimpleTableColumnFilter = {
        columnName,
        values: values ?? currentFilter,
      };
      const ix = simpleTableContext.currentColumnFilters.findIndex(
        (cf) => cf.columnName === columnName,
      );
      // If the current filter is the same as the available list, remove it
      if (isEqual(availableList, currentFilter)) {
        // istanbul ignore else
        if (ix > -1) {
          newColumnFilters.splice(ix, 1);
        }
      } else {
        if (ix > -1) {
          newColumnFilters.splice(ix, 1, newColumnFilter);
        } else {
          newColumnFilters.push(newColumnFilter);
        }
      }
      simpleTableContext.setCurrentColumnFilters(newColumnFilters);
    }
    setLocalFilter("");
    setCurrentFilter([]);
    simpleTableContext.setCurrentColumnFilter(null);
  };

  // Toggle all viewed rows
  const toggleCurrentColumnFilter = () => {
    // Add all items if they are not already in the current filter
    if (currentFilter.length < availableList.length) {
      setCurrentFilter(availableList);
    } else {
      setCurrentFilter([]);
    }
  };

  // Toggle all viewed rows
  const toggleCurrentColumnSearchFilter = () => {
    // istanbul ignore else
    if (availableList) {
      const searchedItems = availableList.filter((v) =>
        v.toLowerCase().includes(localFilter.toLowerCase()),
      );
      // Add selection if any are not included
      if (searchedItems.some((item) => !currentFilter.includes(item))) {
        setCurrentFilter([
          ...searchedItems,
          ...currentFilter.filter((v) => !searchedItems.includes(v)),
        ]);
      }
      // Remove selection if all are included
      else {
        setCurrentFilter(currentFilter.filter((v) => !searchedItems.includes(v)));
        setMatchSearch(false);
      }
    }
  };

  const selectBodyRow = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>,
    v: string,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const newFilter = [...currentFilter];
    const ix = newFilter.findIndex((cf) => cf === v);
    if (ix > -1) {
      newFilter.splice(ix, 1);
    } else {
      newFilter.push(v);
    }
    setCurrentFilter(newFilter);
  };

  const bodyRow = (v: string, i: number) => (
    <tr key={i}>
      <td>
        <div
          className={cbStyles.checkboxContainer}
          onClick={(e) => selectBodyRow(e, v)}
        >
          <input
            aria-label={v}
            id={`${simpleTableContext.id}-columnfilter-${columnName}-check-${i}`}
            type="checkbox"
            role="checkbox"
            className={simpleTableContext.filterCheckClassName}
            checked={currentFilter.includes(v)}
            onChange={(e) => selectBodyRow(e, v)}
          />
        </div>
      </td>
      <td>{v}</td>
    </tr>
  );

  useEffect(() => {
    const attemptFocus = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };

    attemptFocus();
    const timer1 = setTimeout(attemptFocus, 50);
    const timer2 = setTimeout(attemptFocus, 150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // If enter is pressed while the filter is open, apply the filter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Manage the state of the match search checkbox
  useEffect(() => {
    // istanbul ignore else
    if (matchCheck.current) {
      matchCheck.current.checked = matchSearch;
    }
  }, [matchSearch]);

  // Manage the state of the checkboxes based on the current filter and available list
  useEffect(() => {
    // istanbul ignore else
    if (allCheck.current) {
      if (currentFilter?.length === availableList?.length) {
        allCheck.current.checked = true;
        allCheck.current.indeterminate = false;
      } else if (currentFilter.length === 0) {
        allCheck.current.checked = false;
        allCheck.current.indeterminate = false;
      } else {
        allCheck.current.checked = false;
        allCheck.current.indeterminate = true;
      }
    }
    // istanbul ignore else
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
                  ref={inputRef}
                  id={`${simpleTableContext.id}-columnfilter-${columnName}-filter`}
                  aria-label="Column filter search"
                  value={localFilter}
                  onChange={(e) => {
                    setLocalFilter(e.currentTarget.value);
                    if (matchSearch) {
                      setCurrentFilter(
                        availableList.filter((v) =>
                          v.toLowerCase().includes(e.currentTarget.value.toLowerCase()),
                        ),
                      );
                    }
                  }}
                />
                <div className={styles.close}>
                  <CloseSvg onClick={() => onClose()} />
                </div>
              </div>
            </th>
          </tr>
          <tr>
            <th className={styles.boxHeader}>
              <div
                className={cbStyles.checkboxContainer}
                onClick={() => setMatchSearch(!matchSearch)}
              >
                <input
                  ref={matchCheck}
                  id={`${simpleTableContext.id}-columnfilter-${columnName}-match-search`}
                  aria-label="Match search filter"
                  className={simpleTableContext.filterCheckClassName}
                  type="checkbox"
                  role="checkbox"
                />
              </div>
            </th>
            <th>Match search filter</th>
          </tr>
          <tr>
            <th className={styles.boxHeader}>
              <div
                className={cbStyles.checkboxContainer}
                onClick={() => {
                  if (localFilter.trim().length > 0) toggleCurrentColumnSearchFilter();
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
            </th>
            <th>Toggle search values</th>
          </tr>
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
          {availableList
            .filter((v) => v.toLowerCase().includes(localFilter.toLowerCase()))
            .map(bodyRow)}
          {availableList.filter(
            (v) =>
              !v.toLowerCase().includes(localFilter.toLowerCase()) && currentFilter.includes(v),
          ).length > 0 && (
            <tr>
              <th
                colSpan={2}
                style={{ backgroundColor: "grey" }}
              ></th>
            </tr>
          )}
          {availableList
            .filter(
              (v) =>
                !v.toLowerCase().includes(localFilter.toLowerCase()) && currentFilter.includes(v),
            )
            .map(bodyRow)}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>
              <small>
                {`${currentFilter.length} item${currentFilter.length !== 1 ? "s" : ""} selected`}
              </small>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

SimpleTableColumnFilter.displayName = "SimpleTableColumnFilter";
