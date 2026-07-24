import React from "react";

export type ISimpleTableRow = Record<string, unknown>;

export type ISimpleTableFieldName<T extends object = ISimpleTableRow> = Extract<keyof T, string>;

export type ISimpleTableSortFn<
  T extends object = ISimpleTableRow,
  K extends ISimpleTableFieldName<T> = ISimpleTableFieldName<T>,
> = (a: T, b: T, sortBy: ISimpleTableSort<T, K>) => number;

export type ISimpleTableSearchFn<T extends object = ISimpleTableRow> = (
  a: T,
  searchText: string,
) => boolean;

export type ISimpleTableFilterOutFn<T extends object = ISimpleTableRow> = (a: T) => boolean;

export type ISimpleTableHeaderRenderFn<
  T extends object = ISimpleTableRow,
  K extends ISimpleTableFieldName<T> = ISimpleTableFieldName<T>,
> = (a: ISimpleTableHeaderRenderProps<T, K>) => React.ReactElement;

export type ISimpleTableCellRenderFn<
  T extends object = ISimpleTableRow,
  K extends ISimpleTableFieldName<T> = ISimpleTableFieldName<T>,
> = (a: ISimpleTableCellRenderProps<T, K>) => React.ReactElement;

export type ISimpleTableColumnFilterValueFn<TValue = unknown> = (dataItem: TValue) => string[];

export interface ISimpleTableSort<
  T extends object = ISimpleTableRow,
  K extends ISimpleTableFieldName<T> = ISimpleTableFieldName<T>,
> {
  name: K;
  asc: boolean;
  columnFilterValueFn?: ISimpleTableColumnFilterValueFn<T[K]>;
}

export interface ISimpleTableHeaderRenderProps<
  T extends object = ISimpleTableRow,
  K extends ISimpleTableFieldName<T> = ISimpleTableFieldName<T>,
> {
  columnNumber: number;
  field: ISimpleTableField<T, K>;
}

export interface ISimpleTableCellRenderProps<
  T extends object = ISimpleTableRow,
  K extends ISimpleTableFieldName<T> = ISimpleTableFieldName<T>,
> extends ISimpleTableHeaderRenderProps<T, K> {
  cellField: K;
  rowData: T;
  rowNumber: number;
}

export interface ISimpleTableField<
  T extends object = ISimpleTableRow,
  K extends ISimpleTableFieldName<T> = ISimpleTableFieldName<T>,
> {
  name: K;
  label?: string;
  hidden?: boolean;
  width?: string;
  sortFn?: ISimpleTableSortFn<T, K>;
  searchFn?: ISimpleTableSearchFn<T>;
  filterOutFn?: ISimpleTableFilterOutFn<T>;
  headerRenderFn?: ISimpleTableHeaderRenderFn<T, K>;
  renderFn?: ISimpleTableCellRenderFn<T, K>;
  canColumnFilter?: boolean;
  columnFilterValueFn?: ISimpleTableColumnFilterValueFn<T[K]>;
}
