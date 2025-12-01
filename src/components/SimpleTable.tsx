import { Key, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { columnFilterValue } from "../functions/simpleTableNullDate";
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
  selectedBackgroundColor?: string;
  selectInactiveColor?: string;
  selectActiveColor?: string;
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
  currentSelection = [],
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
  selectedBackgroundColor = "rgba(0, 0, 0, 0.8)",
  selectInactiveColor = "rgb(0, 0, 0, 0.2)",
  selectActiveColor = "rgb(255, 153, 0)",
  ...rest
}: SimpleTableProps): React.ReactElement => {
  // Load local settings once on mount
  const localSettingsText =
    typeof window !== "undefined"
      ? window.localStorage.getItem(`asup.simple-table.${id}.settings`)
      : null;
  const localSettings = localSettingsText
    ? (JSON.parse(localSettingsText) as SimpleTableLocalSettings)
    : null;

  const [tableData, setTableData] = useState<ISimpleTableRow[]>(data);
  const [filterData, setFilterData] = useState<boolean>(initialFilterSelected);
  const [sortBy, setSortBy] = useState<ISimpleTableSort | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  // Initialize columnWidths from localStorage or fields
  const [columnWidths, setColumnWidths] = useState<{ name: string; width: string }[]>(() => {
    if (localSettings?.headerWidths && Array.isArray(localSettings.headerWidths)) {
      // Check if it's the old format (string[]) or new format ({ name, width }[])
      if (
        localSettings.headerWidths.length > 0 &&
        !localSettings.headerWidths.every((c) => typeof c === "string" || c === null)
      ) {
        return localSettings.headerWidths as { name: string; width: string }[];
      }
    }
    return fields
      .filter((f) => f.width !== undefined)
      .map((f) => ({ name: f.name, width: f.width as string }));
  });

  // Initialize pageRows from localStorage or props
  const [firstRow, setFirstRow] = useState(showPager === false ? 0 : 0);
  const [pageRows, setPageRows] = useState(() => {
    if (showPager === false) return Infinity;
    if (localSettings?.pageRows && showPager) {
      return localSettings.pageRows === "Infinity" ? Infinity : localSettings.pageRows;
    }
    return 25;
  });

  // Sync external data prop changes - disable eslint for valid prop sync pattern

  useEffect(() => {
    setTableData(data);
  }, [data]);

  // Sync column widths when fields change (not on initial mount, as useState initializer handles that)
  const fieldsInitialized = useRef(false);
  useEffect(() => {
    if (!fieldsInitialized.current) {
      fieldsInitialized.current = true;
      return;
    }
    setColumnWidths(
      fields
        .filter((f) => f.width !== undefined)
        .map((f) => ({ name: f.name, width: f.width as string })),
    );
  }, [fields]);

  // Sync pager state when showPager changes (not on initial mount, as useState initializer handles that)
  const showPagerInitialized = useRef(false);
  useEffect(() => {
    if (!showPagerInitialized.current) {
      showPagerInitialized.current = true;
      return;
    }
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
          .map((cf) => cf.values.includes(columnFilterValue(row[cf.columnName])))
          .reduce((prev, cur) => prev && cur, true);
      })
      .sort(sortFn);
    return _viewData;
  }, [currentColumnFilters, filterFn, searchFn, sortFn, tableData]);

  // Reset firstRow when viewData length changes and firstRow is out of bounds
  useEffect(() => {
    if (viewData.length <= firstRow && viewData.length > 0) {
      setFirstRow(0);
    }
  }, [viewData.length, firstRow]);

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
        values: Array.from(new Set(tableData.map((t) => columnFilterValue(t[f.name])))),
      }));
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
    if (viewedKeys.some((v) => !currentSelection?.includes(v))) {
      setCurrentSelection?.([
        ...currentSelection,
        ...viewedKeys.filter((v) => !currentSelection?.includes(v)),
      ]);
    }
    // Or remove if any of the current selection are all selection
    else {
      setCurrentSelection?.(currentSelection.filter((s) => !viewedKeys.includes(s)));
    }
  }, [currentSelection, keyField, setCurrentSelection, viewData]);
  // Toggle individual row
  const toggleSelection = useCallback(
    (rowId: Key) => {
      // Check key exists
      if (tableData.findIndex((row) => row[keyField] === rowId) > -1) {
        // Create new selection
        const newSelection = [...currentSelection];
        const ix = newSelection.findIndex((s) => s === rowId);
        if (ix > -1) newSelection.splice(ix, 1);
        else newSelection.push(rowId);
        setCurrentSelection?.(newSelection);
      }
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

  // Migrate old settings format if needed (one-time effect on mount)
  const hasRunMigrationRef = useRef(false);
  useEffect(() => {
    if (hasRunMigrationRef.current) return;
    hasRunMigrationRef.current = true;

    const localSettingsText = window.localStorage.getItem(`asup.simple-table.${id}.settings`);
    if (localSettingsText) {
      const localSettings = JSON.parse(localSettingsText) as SimpleTableLocalSettings;
      // Migrate old string[] format to new { name, width }[] format
      if (
        localSettings.headerWidths &&
        Array.isArray(localSettings.headerWidths) &&
        localSettings.headerWidths.length > 0 &&
        localSettings.headerWidths.every((c) => typeof c === "string" || c === null)
      ) {
        const newColumnWidths = fields
          .filter((f) => !f.hidden)
          .map((f, ix) => ({
            name: f.name,
            width: `${(localSettings.headerWidths as (string | null)[])[ix] ?? "undefined"}`,
          }));
        // Only update localStorage, not state, to preserve original behavior
        // where columnWidths only contains explicitly resized columns
        updateLocalSettings("headerWidths", newColumnWidths);
      }
    }
  }, [fields, id, updateLocalSettings]);

  useEffect(() => {
    if (mainBackgroundColor)
      document.documentElement.style.setProperty("--st-main-background-color", mainBackgroundColor);
    if (headerBackgroundColor)
      document.documentElement.style.setProperty(
        "--st-header-background-color",
        headerBackgroundColor,
      );
    if (selectedBackgroundColor)
      document.documentElement.style.setProperty(
        "--st-selected-background-color",
        selectedBackgroundColor,
      );
    if (selectActiveColor)
      document.documentElement.style.setProperty("--st-select-active", selectActiveColor);
    if (selectInactiveColor)
      document.documentElement.style.setProperty("--st-select-inactive", selectInactiveColor);

    return () => {
      // Reset to defaults when component unmounts
      document.documentElement.style.removeProperty("--st-main-background-color");
      document.documentElement.style.removeProperty("--st-header-background-color");
      document.documentElement.style.removeProperty("--st-selected-background-color");
      document.documentElement.style.removeProperty("--st-select-active");
      document.documentElement.style.removeProperty("--st-select-inactive");
    };
  }, [
    mainBackgroundColor,
    headerBackgroundColor,
    selectedBackgroundColor,
    selectActiveColor,
    selectInactiveColor,
  ]);

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
            onWidthChange?.(newColumnWidths);
          },
          pageRows,
          setPageRows: (ret) => {
            setPageRows(ret);
            updateLocalSettings("pageRows", ret);
            onPagerChange?.({ firstRow, pageRows: ret });
          },
          firstRow,
          setFirstRow: (ret) => {
            setFirstRow(ret);
            onPagerChange?.({ firstRow: ret, pageRows });
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
          <div className={styles.titleHolder}>
            <h5 className={styles.title}>
              {showHeader && (
                <>
                  {headerLabel}
                  {selectable && currentSelection.length > 0 && (
                    <small>{currentSelection.length} selected</small>
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
          <div className={styles.footerHolder}>
            <SimpleTablePager />
          </div>
        )}
      </div>
    </SimpleTableContext.Provider>
  );
};

SimpleTable.displayName = "SimpleTable";
