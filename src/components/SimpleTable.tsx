import { Key, startTransition, useEffect, useState } from "react";
import { columnFilterValue } from "../functions/columnFilterValue";
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
import {
  ISimpleTableColumnFilterValueFn,
  ISimpleTableField,
  ISimpleTableFieldName,
  ISimpleTableSort,
} from "./interface";

interface SimpleTableProps<T extends object> extends React.ComponentPropsWithoutRef<"table"> {
  id: string;
  headerLabel?: string;
  fields: ISimpleTableField<T>[];
  keyField: ISimpleTableFieldName<T>;
  data: T[];
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
  onWidthChange?: (ret: { name: ISimpleTableFieldName<T>; width: string }[]) => void;
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
  pageRows?: number | string;
  headerWidths?: (string | undefined)[] | { name: string; width: string }[];
}

// Type guard for SimpleTableLocalSettings
const isSimpleTableLocalSettings = (obj: unknown): obj is SimpleTableLocalSettings => {
  if (typeof obj !== "object" || obj === null) return false;
  const settings = obj as Record<string, unknown>;
  if (settings.pageRows !== undefined) {
    if (typeof settings.pageRows !== "number" && typeof settings.pageRows !== "string")
      return false;
  }
  if (settings.headerWidths !== undefined) {
    if (!Array.isArray(settings.headerWidths)) return false;
  }
  return true;
};

export const SimpleTable = <T extends object>({
  id,
  currentSelection = [],
  data,
  fields,
  filterCheckClassName = "form-check-input",
  filterLabel = "Filter",
  filterLabelClassName = "form-check-label",
  headerBackgroundColor = "white",
  headerLabel,
  initialFilterSelected = false,
  inputGroupClassName = "form-group",
  keyField,
  mainBackgroundColor = "white",
  onPagerChange,
  onWidthChange,
  searchInputClassName = "form-control form-control-sm",
  searchLabel = "Search",
  searchLabelClassName = "form-label",
  selectActiveColor = "rgb(255, 153, 0)",
  selectInactiveColor = "rgb(0, 0, 0, 0.2)",
  selectable = false,
  selectedBackgroundColor = "rgba(0, 0, 0, 0.8)",
  setCurrentSelection,
  showFilter = false,
  showHeader = true,
  showPager = true,
  showSearch = true,
  tableClassName = "",
  ...rest
}: SimpleTableProps<T>): React.ReactElement => {
  // Load local settings once on mount
  const localSettingsText =
    typeof window !== "undefined"
      ? window.localStorage.getItem(`asup.simple-table.${id}.settings`)
      : // istanbul ignore next
        null;
  const parsedSettings = localSettingsText ? JSON.parse(localSettingsText) : null;
  const localSettings = isSimpleTableLocalSettings(parsedSettings) ? parsedSettings : null;
  const columnFilterValueFns: Partial<
    Record<ISimpleTableFieldName<T>, ISimpleTableColumnFilterValueFn>
  > = fields
    .filter((f) => f.columnFilterValueFn)
    .reduce(
      (acc, f) => {
        acc[f.name] = f.columnFilterValueFn as ISimpleTableColumnFilterValueFn;
        return acc;
      },
      {} as Partial<Record<ISimpleTableFieldName<T>, ISimpleTableColumnFilterValueFn>>,
    );

  // Sync external data prop changes
  const [tableData, setTableData] = useState<T[]>(data);
  useEffect(() => {
    startTransition(() => setTableData(data));
  }, [data]);

  const [filterData, setFilterData] = useState<boolean>(initialFilterSelected);
  const [sortBy, setSortBy] = useState<ISimpleTableSort<T> | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  // Initialize columnWidths from localStorage or fields
  const [columnWidths, setColumnWidths] = useState<
    { name: ISimpleTableFieldName<T>; width: string }[]
  >(() => {
    if (localSettings?.headerWidths && Array.isArray(localSettings.headerWidths)) {
      // Check if it's the old format (string[]) or new format ({ name, width }[])
      if (
        localSettings.headerWidths.length > 0 &&
        !localSettings.headerWidths.every((c) => typeof c === "string" || c === null)
      ) {
        return localSettings.headerWidths as { name: ISimpleTableFieldName<T>; width: string }[];
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
      if (localSettings.pageRows === "Infinity") return Infinity;
      return typeof localSettings.pageRows === "string"
        ? parseInt(localSettings.pageRows, 10)
        : localSettings.pageRows;
    }
    return 25;
  });

  useEffect(() => {
    if (showPager === false) {
      startTransition(() => {
        setFirstRow(0);
        setPageRows(Infinity);
      });
    }
  }, [showPager]);

  const [currentColumnFilter, setCurrentColumnFilter] = useState<number | null>(null);
  const [currentColumnFilters, setCurrentColumnFilters] = useState<ISimpleTableColumnFilter<T>[]>(
    [],
  );

  const filterFn = (row: T) => {
    if (showFilter && filterData) {
      const filterFns = fields
        .filter((f) => f.filterOutFn)
        .map((f) => f.filterOutFn as (a: T) => boolean);
      return !filterFns.some((fn) => fn(row));
    } else return true;
  };

  const searchFn = (row: T) => {
    if (showSearch && searchText.trim().length > 0) {
      const searchFns = fields
        .filter((f) => f.searchFn)
        .map((f) => f.searchFn as (a: T, searchText: string) => boolean);
      return searchFns.some((fn) => fn(row, searchText));
    } else return true;
  };

  const sortFn = (rowa: T, rowb: T) => {
    try {
      const sortFn = fields.find((f) => f.name === sortBy?.name)?.sortFn;
      if (sortFn && sortBy)
        return sortBy.asc ? sortFn(rowa, rowb, sortBy) : -sortFn(rowa, rowb, sortBy);
      else return 0;
    } catch (error) {
      console.warn(`Sort failed because ${error}`);
      return 0;
    }
  };

  // Get view data
  const viewData = tableData
    .filter(filterFn)
    .filter(searchFn)
    .filter((row) => {
      return currentColumnFilters
        .map((cf) => {
          const columnValue = columnFilterValue(row[cf.columnName], true);
          return cf.values.some((v) => columnValue.includes(v));
        })
        .reduce((prev, cur) => prev && cur, true);
    })
    .sort(sortFn);

  // Reset firstRow when viewData length changes and firstRow is out of bounds
  useEffect(() => {
    if (viewData.length <= firstRow && viewData.length > 0) {
      startTransition(() => setFirstRow(0));
    }
  }, [viewData.length, firstRow]);

  // Update sort order
  const updateSortBy = (field: ISimpleTableField<T>) => {
    if (field.name === sortBy?.name && sortBy?.asc === false) {
      setSortBy(null);
    } else {
      setSortBy({
        name: field.name,
        asc: field.name === sortBy?.name ? !sortBy.asc : true,
        columnFilterValueFn: columnFilterValueFns[field.name],
      });
    }
  };

  // Get current column items
  // For each column, show values that exist after applying OTHER column filters (Excel-like behavior)
  const currentColumnItems = fields
    .filter((f) => f.canColumnFilter)
    .map((f) => ({
      columnName: f.name,
      values: Array.from(
        new Set(
          tableData
            .filter((row) => {
              // Apply all column filters EXCEPT the one for this column
              return currentColumnFilters
                .filter((cf) => cf.columnName !== f.name)
                .map((cf) => {
                  const columnValue = columnFilterValue(
                    row[cf.columnName],
                    true,
                    columnFilterValueFns[cf.columnName],
                  );
                  return cf.values.some((v) => columnValue.includes(v));
                })
                .reduce((prev, cur) => prev && cur, true);
            })
            .flatMap((t) => columnFilterValue(t[f.name], true, columnFilterValueFns[f.name])),
        ),
      ),
    }));

  // Toggle all viewed rows
  const toggleAllCurrentSelection = () => {
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
  };

  // Toggle individual row
  const toggleSelection = (rowId: Key) => {
    // Check key exists
    // istanbul ignore else
    if (tableData.findIndex((row) => row[keyField] === rowId) > -1) {
      // Create new selection
      const newSelection = [...currentSelection];
      const ix = newSelection.findIndex((s) => s === rowId);
      if (ix > -1) newSelection.splice(ix, 1);
      else newSelection.push(rowId);
      setCurrentSelection?.(newSelection);
    }
  };

  // Save local settings
  const updateLocalSettings = (
    setting: string,
    value: number | { name: ISimpleTableFieldName<T>; width: string }[],
  ) => {
    const localSettingsText = window.localStorage.getItem(`asup.simple-table.${id}.settings`);
    const localSettings = JSON.parse(localSettingsText ?? "{}") as SimpleTableLocalSettings;
    // istanbul ignore else
    if (setting === "pageRows" && value && !Array.isArray(value)) {
      localSettings.pageRows = value === Infinity ? "Infinity" : value;
    } else if (setting === "headerWidths" && value && Array.isArray(value)) {
      localSettings.headerWidths = value;
    }
    window.localStorage.setItem(`asup.simple-table.${id}.settings`, JSON.stringify(localSettings));
  };

  useEffect(() => {
    // istanbul ignore else
    if (mainBackgroundColor)
      document.documentElement.style.setProperty("--st-main-background-color", mainBackgroundColor);
    // istanbul ignore else
    if (headerBackgroundColor)
      document.documentElement.style.setProperty(
        "--st-header-background-color",
        headerBackgroundColor,
      );
    // istanbul ignore else
    if (selectedBackgroundColor)
      document.documentElement.style.setProperty(
        "--st-selected-background-color",
        selectedBackgroundColor,
      );
    // istanbul ignore else
    if (selectActiveColor)
      document.documentElement.style.setProperty("--st-select-active", selectActiveColor);
    // istanbul ignore else
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
          setColumnWidth: (name: ISimpleTableFieldName<T>, width: string) => {
            const newColumnWidths = [...columnWidths];
            // istanbul ignore else
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
          setPageRows: (ret: number) => {
            setPageRows(ret);
            updateLocalSettings("pageRows", ret);
            onPagerChange?.({ firstRow, pageRows: ret });
          },
          firstRow,
          setFirstRow: (ret: number) => {
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
        } as unknown as ISimpleTableContext
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
