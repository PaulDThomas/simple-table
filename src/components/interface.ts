export interface iSimpleTableRow {
  [key: string]: unknown;
}

export interface iSimpleTableSort {
  name: string;
  asc: boolean;
}

export interface iSimpleTableHeaderRenderProps {
  columnNumber: number;
  field: iSimpleTableField;
}

export interface iSimpleTableCellRenderProps extends iSimpleTableHeaderRenderProps {
  cellField: string;
  rowData: iSimpleTableRow;
  rowNumber: number;
}

export interface iSimpleTableField {
  name: string;
  label?: string;
  hidden?: boolean;
  width?: string;
  sortFn?: (a: iSimpleTableRow, b: iSimpleTableRow, sortBy: iSimpleTableSort) => number;
  searchFn?: (a: iSimpleTableRow, searchText: string) => boolean;
  filterOutFn?: (a: iSimpleTableRow) => boolean;
  headerRenderFn?: (a: iSimpleTableHeaderRenderProps) => JSX.Element;
  renderFn?: (a: iSimpleTableCellRenderProps) => JSX.Element;
  canColumnFilter?: boolean;
}
