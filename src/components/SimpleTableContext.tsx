import { createContext, Key } from "react";
import { ISimpleTableField, ISimpleTableRow, ISimpleTableSort } from "./interface";

export interface ISimpleTableColumnFilter {
  columnName: string;
  values: string[];
}

export interface ISimpleTableContext {
  id: string;
  fields: ISimpleTableField[];
  keyField: string;
  viewData: ISimpleTableRow[];
  totalRows: number;
  setTableData?: (ret: ISimpleTableRow[]) => void;
  selectable?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  filterLabel?: string;
  filterData?: boolean;
  setFilterData?: (ret: boolean) => void;
  searchLabel?: string;
  searchText?: string;
  setSearchText?: (ret: string) => void;
  sortBy?: ISimpleTableSort;
  updateSortBy?: (ret: ISimpleTableField) => void;
  currentSelection?: Key[];
  toggleAllCurrentSelection?: () => void;
  toggleSelection?: (ret: Key) => void;

  columnWidths: { name: string; width: string }[];
  setColumnWidth?: (columnName: string, width: string) => void;
  pageRows: number;
  setPageRows?: (ret: number) => void;
  firstRow: number;
  setFirstRow?: (ret: number) => void;

  currentColumnItems: ISimpleTableColumnFilter[];
  currentColumnFilter: number | null;
  setCurrentColumnFilter?: (ret: number | null) => void;
  currentColumnFilters: ISimpleTableColumnFilter[];
  setCurrentColumnFilters?: (ret: ISimpleTableColumnFilter[]) => void;

  inputGroupClassName?: string;
  filterLabelClassName?: string;
  filterCheckClassName?: string;
  searchLabelClassName?: string;
  searchInputClassName?: string;
}

export const SimpleTableContext = createContext<ISimpleTableContext>({
  id: "simple-table",
  fields: [],
  keyField: "",
  viewData: [],
  totalRows: 0,
  firstRow: 0,
  pageRows: 50,
  columnWidths: [],
  currentColumnItems: [],
  currentColumnFilter: null,
  currentColumnFilters: [],
});
