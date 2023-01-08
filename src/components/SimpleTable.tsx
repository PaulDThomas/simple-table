import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { iSimpleTableField, iSimpleTableRow, iSimpleTableSort } from './interface';
import './SimpleTable.css';
import { SimpleTableBody } from './SimpleTableBody';
import { iSimpleTableContext, SimpleTableContext } from './SimpleTableContext';
import { SimpleTableFilter } from './SimpleTableFilter';
import { SimpleTableHeader } from './SimpleTableHeader';
import { SimpleTableSearch } from './SimpleTableSearch';
import { SimpleTableSelectHeader } from './SimpleTableSelectHeader';

interface iSimpleTable {
  id?: string;
  headerLabel?: string;
  fields: iSimpleTableField[];
  keyField: string;
  data: iSimpleTableRow[];
  selectable?: boolean;
  currentSelection?: Key[];
  setCurrentSelection?: (ret: Key[]) => void;
  showSearch?: boolean;
  showFilter?: boolean;
  initialFilterSelected?: boolean;
  filterLabel?: string;
  searchLabel?: string;

  tableClassName?: string;
  inputGroupClassName?: string;
  filterLabelClassName?: string;
  filterCheckClassName?: string;
  searchLabelClassName?: string;
  searchInputClassName?: string;

  mainBackgroundColor?: string;
  headerBackgroundColor?: string;
  firstColumnBackgroundColor?: string;
}

export const SimpleTable = ({
  id = 'simple-table',
  headerLabel = 'Simple table',
  fields,
  keyField,
  data,
  selectable = false,
  currentSelection,
  setCurrentSelection,
  showSearch = true,
  showFilter = false,
  initialFilterSelected = false,
  filterLabel = 'Filter',
  searchLabel = 'Search',
  tableClassName = 'simpletable table table-responsive table-striped table-sm',
  inputGroupClassName = 'form-group',
  filterLabelClassName = 'form-check-label',
  filterCheckClassName = 'form-check-input',
  searchLabelClassName = 'form-label',
  searchInputClassName = 'form-control form-control-sm',
  mainBackgroundColor = 'white',
  headerBackgroundColor = 'white',
  firstColumnBackgroundColor = 'white',
}: iSimpleTable): JSX.Element => {
  const [tableData, setTableData] = useState<iSimpleTableRow[]>(data);
  useEffect(() => {
    setTableData(data);
  }, [data]);
  const [filterData, setFilterData] = useState<boolean>(initialFilterSelected);
  const [sortBy, setSortBy] = useState<iSimpleTableSort | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  const filterFn = useCallback(
    (row: iSimpleTableRow) => {
      if (showFilter && filterData) {
        const filterFns = fields
          .filter((f) => f.filterOutFn)
          .map((f) => f.filterOutFn as (a: iSimpleTableRow) => boolean);
        return !filterFns.some((fn) => fn(row));
      } else return true;
    },
    [fields, filterData, showFilter],
  );

  const searchFn = useCallback(
    (row: iSimpleTableRow) => {
      if (showSearch && searchText.trim().length > 0) {
        const searchFns = fields
          .filter((f) => f.searchFn)
          .map((f) => f.searchFn as (a: iSimpleTableRow, searchText: string) => boolean);
        return searchFns.some((fn) => fn(row, searchText));
      } else return true;
    },
    [fields, searchText, showSearch],
  );

  const sortFn = useCallback(
    (rowa: iSimpleTableRow, rowb: iSimpleTableRow) => {
      const sortFn = fields.find((f) => f.name === sortBy?.name)?.sortFn;
      if (sortFn && sortBy)
        return sortBy.asc ? sortFn(rowa, rowb, sortBy) : -sortFn(rowa, rowb, sortBy);
      else return 0;
    },
    [fields, sortBy],
  );

  // Get view data
  const viewData = useMemo(() => {
    return tableData.filter(filterFn).filter(searchFn).sort(sortFn);
  }, [filterFn, searchFn, sortFn, tableData]);

  // Update sort order
  const updateSortBy = useCallback(
    (field: iSimpleTableField) => {
      if (field.name === sortBy?.name && sortBy?.asc === false) {
        setSortBy(null);
      } else {
        setSortBy({
          name: field.name,
          asc: field.name === sortBy?.name ? !sortBy.asc : true,
        });
      }
    },
    [sortBy],
  );

  // Toggle all viewed rows
  const toggleAllCurrentSelection = useCallback(() => {
    // Select available if some are not selected
    const viewedKeys: Key[] = viewData
      .filter(
        (rowData) => typeof rowData[keyField] === 'string' || typeof rowData[keyField] === 'number',
      )
      .map((rowData) => rowData[keyField] as Key);
    // Add if any of the current selection are not selected
    if (setCurrentSelection && viewedKeys.some((v) => !currentSelection?.includes(v))) {
      setCurrentSelection([
        ...(currentSelection ?? []),
        ...viewedKeys.filter((v) => !currentSelection?.includes(v)),
      ]);
    }
    // Or remove if any of the current selection are all selection
    else {
      setCurrentSelection &&
        setCurrentSelection(currentSelection?.filter((s) => !viewedKeys.includes(s)) ?? []);
    }
  }, [currentSelection, keyField, setCurrentSelection, viewData]);
  // Toggle individual row
  const toggleSelection = useCallback(
    (rowId: Key) => {
      // Check key exists
      if (tableData.findIndex((row) => row[keyField] === rowId) === -1) return;
      // Create new selection
      const newSelection = [...(currentSelection ?? [])];
      const ix = newSelection.findIndex((s) => s === rowId);
      if (ix > -1) newSelection.splice(ix, 1);
      else newSelection.push(rowId);
      setCurrentSelection && setCurrentSelection(newSelection);
    },
    [currentSelection, keyField, setCurrentSelection, tableData],
  );

  return (
    <div
      className='simpletable-holder'
      style={{ backgroundColor: mainBackgroundColor }}
    >
      <SimpleTableContext.Provider
        value={
          {
            id,
            fields,
            keyField,
            viewData,
            tableData,
            setTableData,
            selectable,
            showSearch,
            showFilter,
            filterLabel,
            filterData,
            setFilterData,
            searchLabel,
            searchText,
            setSearchText,
            sortBy,
            updateSortBy,
            currentSelection,
            toggleAllCurrentSelection,
            toggleSelection,

            inputGroupClassName,
            filterLabelClassName,
            filterCheckClassName,
            searchLabelClassName,
            searchInputClassName,

            headerBackgroundColor,
            firstColumnBackgroundColor,
          } as iSimpleTableContext
        }
      >
        <div className='simpletable-title-holder-roof' />
        <div
          className='simpletable-title-holder'
          style={{ backgroundColor: mainBackgroundColor }}
        >
          {headerLabel && (
            <h5 className='simpletable-title'>
              {headerLabel}
              {selectable && (currentSelection?.length ?? 0) > 0 && (
                <small style={{ fontSize: 'small' }}>
                  {} {currentSelection?.length} selected
                </small>
              )}
            </h5>
          )}
          {showSearch && fields.filter((f) => f.searchFn).length > 0 && <SimpleTableSearch />}
          {showFilter && fields.filter((f) => f.filterOutFn).length > 0 && <SimpleTableFilter />}
        </div>
        <div className='simpletable-title-holder-floor' />
        <table
          id={id}
          className={`simpletable ${tableClassName}`}
        >
          <thead>
            <tr>
              {selectable && <SimpleTableSelectHeader />}
              <SimpleTableHeader />
            </tr>
          </thead>
          <SimpleTableBody />
        </table>
      </SimpleTableContext.Provider>
    </div>
  );
};
