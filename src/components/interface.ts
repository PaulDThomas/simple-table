export interface iSimpleTableRow {
  [key: string]: unknown;
}

export interface iSimpleTableSort {
  name: string;
  asc: boolean;
}

export interface iSimpleTableCellRenderProps {
  columnNumber: number;
  cellField: string;
  rowData: iSimpleTableRow;
}

export interface iSimpleTableField {
  name: string;
  label?: string;
  hidden?: boolean;
  width?: string;
  sortFn?: (a: iSimpleTableRow, b: iSimpleTableRow, sortBy: iSimpleTableSort) => number;
  searchFn?: (a: iSimpleTableRow, searchText: string) => boolean;
  filterOutFn?: (a: iSimpleTableRow) => boolean;
  renderFn?: (a: iSimpleTableCellRenderProps) => JSX.Element;
}
