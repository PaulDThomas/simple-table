import React, { Key } from 'react';
import { iSimpleTableField, iSimpleTableRow, iSimpleTableSort } from './interface';

export interface iSimpleTableContext {
  id: string;
  fields: iSimpleTableField[];
  keyField: string;
  viewData: iSimpleTableRow[];
  tableData: iSimpleTableRow[];
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

  inputGroupClassName?: string;
  filterLabelClassName?: string;
  filterCheckClassName?: string;
  searchLabelClassName?: string;
  searchInputClassName?: string;

  headerBackgroundColor?: string;
}

export const SimpleTableContext = React.createContext<iSimpleTableContext>({
  id: 'simple-table',
  fields: [],
  keyField: '',
  viewData: [],
  tableData: [],
  headerBackgroundColor: 'white',
});
