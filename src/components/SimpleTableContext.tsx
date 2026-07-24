import { createContext, Key } from "react";
import {
  ISimpleTableField,
  ISimpleTableFieldName,
  ISimpleTableRow,
  ISimpleTableSort,
} from "./interface";

export interface ISimpleTableColumnFilter<T extends ISimpleTableRow = ISimpleTableRow> {
  columnName: ISimpleTableFieldName<T>;
  values: string[];
}

export interface ISimpleTableContext<T extends ISimpleTableRow = ISimpleTableRow> {
  id: string;
  fields: ISimpleTableField<T>[];
  keyField: ISimpleTableFieldName<T>;
  viewData: T[];
  totalRows: number;
  setTableData: (ret: T[]) => void;
  selectable?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  filterLabel?: string;
  filterData?: boolean;
  setFilterData: (ret: boolean) => void;
  searchLabel?: string;
  searchText?: string;
  setSearchText: (ret: string) => void;
  sortBy?: ISimpleTableSort<T>;
  updateSortBy: (ret: ISimpleTableField<T>) => void;
  currentSelection: Key[];
  toggleAllCurrentSelection: () => void;
  toggleSelection: (ret: Key) => void;

  columnWidths: { name: ISimpleTableFieldName<T>; width: string }[];
  setColumnWidth: (columnName: ISimpleTableFieldName<T>, width: string) => void;
  pageRows: number;
  setPageRows: (ret: number) => void;
  firstRow: number;
  setFirstRow: (ret: number) => void;

  currentColumnItems: ISimpleTableColumnFilter<T>[];
  currentColumnFilter: number | null;
  setCurrentColumnFilter: (ret: number | null) => void;
  currentColumnFilters: ISimpleTableColumnFilter<T>[];
  setCurrentColumnFilters: (ret: ISimpleTableColumnFilter<T>[]) => void;

  inputGroupClassName?: string;
  filterLabelClassName?: string;
  filterCheckClassName?: string;
  searchLabelClassName?: string;
  searchInputClassName?: string;

  headerBackgroundColor?: string;
}

// istanbul ignore next
const defaultFn = () => {};

export const defaultContext: ISimpleTableContext = {
  id: "simple-table",
  fields: [],
  keyField: "" as ISimpleTableFieldName,
  viewData: [],
  totalRows: 0,
  setTableData: defaultFn,
  setFilterData: defaultFn,
  setSearchText: defaultFn,
  updateSortBy: defaultFn,
  currentSelection: [],
  toggleAllCurrentSelection: defaultFn,
  toggleSelection: defaultFn,
  setColumnWidth: defaultFn,
  pageRows: 50,
  setPageRows: defaultFn,
  firstRow: 0,
  setFirstRow: defaultFn,
  columnWidths: [],
  currentColumnItems: [],
  currentColumnFilter: null,
  currentColumnFilters: [],
  setCurrentColumnFilter: defaultFn,
  setCurrentColumnFilters: defaultFn,
} as ISimpleTableContext;

export const SimpleTableContext = createContext<ISimpleTableContext>(defaultContext);
