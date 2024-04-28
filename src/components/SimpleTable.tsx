import { Key, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./SimpleTable.module.css";
import { SimpleTableBody } from "./SimpleTableBody";
import {
  ISimpleTableColumnFilter,
  ISimpleTableContext,
  SimpleTableContext,
} from "./SimpleTableContext";
import { SimpleTableFilter } from "./SimpleTableFilter";
import { SimpleTableHeader } from "./SimpleTableHeader";
import { SimpleTablePager } from "./SimpleTablePager";
import { SimpleTableSearch } from "./SimpleTableSearch";
import { SimpleTableSelectHeader } from "./SimpleTableSelectHeader";
import { ISimpleTableField, ISimpleTableRow, ISimpleTableSort } from "./interface";

interface SimpleTableProps extends React.ComponentPropsWithoutRef<"table"> {
  id?: string;
  headerLabel?: string;
  fields: ISimpleTableField[];
  keyField: string;
  data: ISimpleTableRow[];
  selectable?: boolean;
  currentSelection?: Key[];
  setCurrentSelection?: (ret: Key[]) => void;
  showHeader?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  showPager?: boolean;
  initialFilterSelected?: boolean;
  filterLabel?: string;
  searchLabel?: string;
  onWidthChange?: (ret: { name: string; width: string }[]) => void;
  onPagerChange?: (ret: { firstRow: number; pageRows: number }) => void;

  tableClassName?: string;
  inputGroupClassName?: string;
  filterLabelClassName?: string;
  filterCheckClassName?: string;
  searchLabelClassName?: string;
  searchInputClassName?: string;

  mainBackgroundColor?: string;
  headerBackgroundColor?: string;
}

interface SimpleTableLocalSettings {
  pageRows?: number | "Infinity";
  headerWidths?: (string | undefined)[] | { name: string; width: string }[];
}

export const SimpleTable = ({
  id = "simple-table",
  headerLabel = "Simple table",
  fields,
  keyField,
  data,
  selectable = false,
  currentSelection,
  setCurrentSelection,
  showHeader = true,
  showSearch = true,
  showFilter = false,
  showPager = true,
  initialFilterSelected = false,
  filterLabel = "Filter",
  searchLabel = "Search",
  onWidthChange,
  onPagerChange,
  tableClassName = "",
  inputGroupClassName = "form-group",
  filterLabelClassName = "form-check-label",
  filterCheckClassName = "form-check-input",
  searchLabelClassName = "form-label",
  searchInputClassName = "form-control form-control-sm",
  mainBackgroundColor = "white",
  headerBackgroundColor = "white",
  ...rest
}: SimpleTableProps): JSX.Element => {
  const [tableData, setTableData] = useState<ISimpleTableRow[]>(data);
  useEffect(() => {
    setTableData(data);
  }, [data]);
  const [filterData, setFilterData] = useState<boolean>(initialFilterSelected);
  const [sortBy, setSortBy] = useState<ISimpleTableSort | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [columnWidths, setColumnWidths] = useState<{ name: string; width: string }[]>([]);
  useEffect(
    () =>
      setColumnWidths(
        fields
          .filter((f) => f.width !== undefined)
          .map((f) => ({ name: f.name, width: f.width as string })),
      ),
    [fields],
  );

  const [firstRow, setFirstRow] = useState(0);
  const [pageRows, setPageRows] = useState(25);
  useEffect(() => {
    if (showPager === false) {
      setFirstRow(0);
      setPageRows(Infinity);
    }
  }, [showPager]);

  const [currentColumnFilter, setCurrentColumnFilter] = useState<number | null>(null);
  const [currentColumnFilters, setCurrentColumnFilters] = useState<ISimpleTableColumnFilter[]>([]);

  const filterFn = useCallback(
    (row: ISimpleTableRow) => {
      if (showFilter && filterData) {
        const filterFns = fields
          .filter((f) => f.filterOutFn)
          .map((f) => f.filterOutFn as (a: ISimpleTableRow) => boolean);
        return !filterFns.some((fn) => fn(row));
      } else return true;
    },
    [fields, filterData, showFilter],
  );

  const searchFn = useCallback(
    (row: ISimpleTableRow) => {
      if (showSearch && searchText.trim().length > 0) {
        const searchFns = fields
          .filter((f) => f.searchFn)
          .map((f) => f.searchFn as (a: ISimpleTableRow, searchText: string) => boolean);
        return searchFns.some((fn) => fn(row, searchText));
      } else return true;
    },
    [fields, searchText, showSearch],
  );

  const sortFn = useCallback(
    (rowa: ISimpleTableRow, rowb: ISimpleTableRow) => {
      try {
        const sortFn = fields.find((f) => f.name === sortBy?.name)?.sortFn;
        if (sortFn && sortBy)
          return sortBy.asc ? sortFn(rowa, rowb, sortBy) : -sortFn(rowa, rowb, sortBy);
        else return 0;
      } catch (error) {
        console.warn(`Sort failed because ${error}`);
        return 0;
      }
    },
    [fields, sortBy],
  );

  // Get view data
  const viewData = useMemo(() => {
    const _viewData = tableData
      .filter(filterFn)
      .filter(searchFn)
      .filter((row) => {
        return currentColumnFilters
          .map((cf) => {
            if (row[cf.columnName] !== undefined) {
              return cf.values.includes(
                typeof row[cf.columnName] === "number"
                  ? (row[cf.columnName] as number).toString()
                  : `${row[cf.columnName] ?? "<blank>"}`,
              );
            } else return true;
          })
          .reduce((prev, cur) => prev && cur, true);
      })
      .sort(sortFn);
    if (_viewData.length <= firstRow) {
      setFirstRow(0);
    }
    return _viewData;
  }, [currentColumnFilters, filterFn, firstRow, searchFn, sortFn, tableData]);

  // Update sort order
  const updateSortBy = useCallback(
    (field: ISimpleTableField) => {
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

  // Get current column items
  const currentColumnItems = useMemo(() => {
    const ret = fields
      .filter((f) => f.canColumnFilter)
      .map((f) => ({
        columnName: f.name,
        values: Array.from(
          new Set(
            tableData.map((t) =>
              typeof t[f.name] === "number"
                ? (t[f.name] as number).toString()
                : `${t[f.name] ?? "<blank>"}`,
            ),
          ),
        ),
      }));
    setCurrentColumnFilters(ret);
    return ret;
  }, [fields, tableData]);

  // Toggle all viewed rows
  const toggleAllCurrentSelection = useCallback(() => {
    // Select available if some are not selected
    const viewedKeys: Key[] = viewData
      .filter(
        (rowData) => typeof rowData[keyField] === "string" || typeof rowData[keyField] === "number",
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

  // Save local settings
  const updateLocalSettings = useCallback(
    (setting: string, value: number | { name: string; width: string }[]) => {
      const localSettingsText = window.localStorage.getItem(`asup.simple-table.${id}.settings`);
      const localSettings = JSON.parse(localSettingsText ?? "{}") as SimpleTableLocalSettings;
      if (setting === "pageRows" && value && !Array.isArray(value)) {
        localSettings.pageRows = value === Infinity ? "Infinity" : value;
      } else if (setting === "headerWidths" && value && Array.isArray(value)) {
        localSettings.headerWidths = value;
      }
      window.localStorage.setItem(
        `asup.simple-table.${id}.settings`,
        JSON.stringify(localSettings),
      );
    },
    [id],
  );

  // Load any previous settings, should only run on load
  useEffect(() => {
    const localSettingsText = window.localStorage.getItem(`asup.simple-table.${id}.settings`);
    if (localSettingsText) {
      const localSettings = JSON.parse(localSettingsText) as SimpleTableLocalSettings;
      localSettings.pageRows &&
        showPager &&
        setPageRows(localSettings.pageRows === "Infinity" ? Infinity : localSettings.pageRows);
      if (
        localSettings.headerWidths &&
        Array.isArray(localSettings.headerWidths) &&
        localSettings.headerWidths.length > 0 &&
        typeof localSettings.headerWidths[0] === "string"
      ) {
        const newColumnWidths = fields
          .filter((f) => !f.hidden)
          .map((f, ix) => ({
            name: f.name,
            width: (localSettings.headerWidths as string[])[ix],
          }));
        updateLocalSettings("headerWidths", newColumnWidths);
      } else if (localSettings.headerWidths && Array.isArray(localSettings.headerWidths)) {
        setColumnWidths(localSettings.headerWidths as { name: string; width: string }[]);
      }
    }
  }, [fields, id, showPager, updateLocalSettings]);

  return (
    <SimpleTableContext.Provider
      value={
        {
          id,
          fields,
          keyField,
          viewData,
          totalRows: tableData.length,
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

          columnWidths,
          setColumnWidth: (name: string, width: string) => {
            const newColumnWidths = [...columnWidths];
            if (fields.map((f) => f.name).includes(name)) {
              const ix = newColumnWidths.findIndex((c) => c.name === name);
              if (ix === -1) {
                newColumnWidths.push({ name: name, width });
              } else {
                newColumnWidths[ix] = { name: name, width: width };
              }
            }
            setColumnWidths(newColumnWidths);
            updateLocalSettings("headerWidths", newColumnWidths);
            onWidthChange && onWidthChange(newColumnWidths);
          },
          pageRows,
          setPageRows: (ret) => {
            setPageRows(ret);
            updateLocalSettings("pageRows", ret);
            onPagerChange && onPagerChange({ firstRow, pageRows: ret });
          },
          firstRow,
          setFirstRow: (ret) => {
            setFirstRow(ret);
            onPagerChange && onPagerChange({ firstRow: ret, pageRows });
          },

          currentColumnItems,
          currentColumnFilter,
          setCurrentColumnFilter,
          currentColumnFilters,
          setCurrentColumnFilters,

          inputGroupClassName,
          filterLabelClassName,
          filterCheckClassName,
          searchLabelClassName,
          searchInputClassName,

          headerBackgroundColor,
        } as ISimpleTableContext
      }
    >
      <div className={styles.main}>
        {(showHeader || showSearch || showFilter) && (
          <div
            className={styles.titleHolder}
            style={{ backgroundColor: mainBackgroundColor }}
          >
            <h5 className={styles.title}>
              {showHeader && (
                <>
                  {headerLabel}
                  {selectable && (currentSelection?.length ?? 0) > 0 && (
                    <small>
                      {} {currentSelection?.length} selected
                    </small>
                  )}
                </>
              )}
            </h5>
            {showSearch && fields.filter((f) => f.searchFn).length > 0 && <SimpleTableSearch />}
            {showFilter && fields.filter((f) => f.filterOutFn).length > 0 && <SimpleTableFilter />}
          </div>
        )}
        <div
          className={styles.scroll}
          style={{
            backgroundColor: mainBackgroundColor,
            height: `calc(100% ${showHeader || showSearch || showFilter ? "- 46px" : ""} ${
              showPager ? " - 1.75rem" : ""
            }`,
          }}
        >
          <div className={styles.holder}>
            <table
              {...rest}
              id={id}
              className={[styles.table, tableClassName].join(" ")}
            >
              <thead>
                <tr>
                  {selectable && <SimpleTableSelectHeader />}
                  <SimpleTableHeader />
                </tr>
              </thead>
              <SimpleTableBody />
            </table>
          </div>
        </div>
        {showPager && (
          <div
            className={styles.footerHolder}
            style={{ backgroundColor: mainBackgroundColor }}
          >
            <SimpleTablePager />
          </div>
        )}
      </div>
    </SimpleTableContext.Provider>
  );
};

SimpleTable.displayName = "SimpleTable";
