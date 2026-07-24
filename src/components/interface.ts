import React from "react";

export interface ISimpleTableRow {
  [key: string]: unknown;
}

export interface ISimpleTableSort {
  name: string;
  asc: boolean;
  columnFilterValueFn?: (dataItem: unknown, showBlank?: boolean) => string;
}

export interface ISimpleTableHeaderRenderProps {
  columnNumber: number;
  field: ISimpleTableField;
}

export interface ISimpleTableCellRenderProps extends ISimpleTableHeaderRenderProps {
  cellField: string;
  rowData: ISimpleTableRow;
  rowNumber: number;
}

export interface ISimpleTableField {
  name: string;
  label?: string;
  hidden?: boolean;
  width?: string;
  sortFn?: (a: ISimpleTableRow, b: ISimpleTableRow, sortBy: ISimpleTableSort) => number;
  searchFn?: (a: ISimpleTableRow, searchText: string) => boolean;
  filterOutFn?: (a: ISimpleTableRow) => boolean;
  headerRenderFn?: (a: ISimpleTableHeaderRenderProps) => React.ReactElement;
  renderFn?: (a: ISimpleTableCellRenderProps) => React.ReactElement;
  canColumnFilter?: boolean;
  columnFilterValueFn?: (dataItem: unknown, showBlank?: boolean) => string;
}
