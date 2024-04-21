export interface ISimpleTableRow {
  [key: string]: unknown;
}

export interface ISimpleTableSort {
  name: string;
  asc: boolean;
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
  headerRenderFn?: (a: ISimpleTableHeaderRenderProps) => JSX.Element;
  renderFn?: (a: ISimpleTableCellRenderProps) => JSX.Element;
  canColumnFilter?: boolean;
}
