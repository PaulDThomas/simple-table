import React from "react";

export interface ISimpleTableRow {
  [key: string]: unknown;
}

export type ISimpleTableSortFn = (
  a: ISimpleTableRow,
  b: ISimpleTableRow,
  sortBy: ISimpleTableSort,
) => number;

export type ISimpleTableSearchFn = (a: ISimpleTableRow, searchText: string) => boolean;

export type ISimpleTableFilterOutFn = (a: ISimpleTableRow) => boolean;

export type ISimpleTableHeaderRenderFn = (a: ISimpleTableHeaderRenderProps) => React.ReactElement;

export type ISimpleTableCellRenderFn = (a: ISimpleTableCellRenderProps) => React.ReactElement;

export type ISimpleTableColumnFilterValueFn = (dataItem: unknown) => string[];

export interface ISimpleTableSort {
  name: string;
  asc: boolean;
  columnFilterValueFn?: ISimpleTableColumnFilterValueFn;
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
  sortFn?: ISimpleTableSortFn;
  searchFn?: ISimpleTableSearchFn;
  filterOutFn?: ISimpleTableFilterOutFn;
  headerRenderFn?: ISimpleTableHeaderRenderFn;
  renderFn?: ISimpleTableCellRenderFn;
  canColumnFilter?: boolean;
  columnFilterValueFn?: ISimpleTableColumnFilterValueFn;
}
