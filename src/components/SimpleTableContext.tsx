import React, { Key } from "react";
import { iSimpleTableField, iSimpleTableRow, iSimpleTableSort } from "./interface";

export interface iSimpleTableColumnFilter {
  columnName: string;
  values: string[];
}

export interface iSimpleTableContext {
  id: string;
  fields: iSimpleTableField[];
  keyField: string;
  viewData: iSimpleTableRow[];
  totalRows: number;
  setTableData?: (ret: iSimpleTableRow[]) => void;
  selectable?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  filterLabel?: string;
  filterData?: boolean;
  setFilterData?: (ret: boolean) => void;
  searchLabel?: string;
  searchText?: string;
  setSearchText?: (ret: string) => void;
  sortBy?: iSimpleTableSort;
  updateSortBy?: (ret: iSimpleTableField) => void;
  currentSelection?: Key[];
  toggleAllCurrentSelection?: () => void;
  toggleSelection?: (ret: Key) => void;

  columnWidths: (string | undefined)[];
  setColumnWidth?: (col: number, width: string) => void;
  pageRows: number;
  setPageRows?: (ret: number) => void;
  firstRow: number;
  setFirstRow?: (ret: number) => void;

  currentColumnItems: iSimpleTableColumnFilter[];
  currentColumnFilter: number | null;
  setCurrentColumnFilter?: (ret: number | null) => void;
  currentColumnFilters: iSimpleTableColumnFilter[];
  setCurrentColumnFilters?: (ret: iSimpleTableColumnFilter[]) => void;

  inputGroupClassName?: string;
  filterLabelClassName?: string;
  filterCheckClassName?: string;
  searchLabelClassName?: string;
  searchInputClassName?: string;

  headerBackgroundColor?: string;
}

export const SimpleTableContext = React.createContext<iSimpleTableContext>({
  id: "simple-table",
  fields: [],
  keyField: "",
  viewData: [],
  totalRows: 0,
  headerBackgroundColor: "white",
  firstRow: 0,
  pageRows: 50,
  columnWidths: [],
  currentColumnItems: [],
  currentColumnFilter: null,
  currentColumnFilters: [],
});
