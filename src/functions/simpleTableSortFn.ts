import { ISimpleTableFieldName, ISimpleTableRow, ISimpleTableSort } from "../components";
import { columnFilterValue } from "./columnFilterValue";

export function simpleTableSortFn<T extends object, K extends ISimpleTableFieldName<T>>(
  a: T,
  b: T,
  sortBy: ISimpleTableSort<T, K>,
): number;
export function simpleTableSortFn(
  a: ISimpleTableRow,
  b: ISimpleTableRow,
  sortBy: ISimpleTableSort,
): number;
export function simpleTableSortFn(
  a: ISimpleTableRow,
  b: ISimpleTableRow,
  sortBy: ISimpleTableSort,
): number {
  const ret = sortBy.columnFilterValueFn
    ? (
        columnFilterValue(a[sortBy.name], false, sortBy.columnFilterValueFn)[0] ??
        // istanbul ignore next
        ""
      ).localeCompare(
        columnFilterValue(b[sortBy.name], false, sortBy.columnFilterValueFn)[0] ??
          // istanbul ignore next
          "",
      )
    : typeof a[sortBy.name] === "number" || typeof b[sortBy.name] === "number"
      ? ((typeof a[sortBy.name] === "number" ? a[sortBy.name] : -Infinity) as number) -
        ((typeof b[sortBy.name] === "number" ? b[sortBy.name] : -Infinity) as number)
      : a[sortBy.name] instanceof Date && b[sortBy.name] instanceof Date
        ? (a[sortBy.name] as Date).getTime() - (b[sortBy.name] as Date).getTime()
        : (
            columnFilterValue(a[sortBy.name], false)[0] ??
            // istanbul ignore next
            ""
          ).localeCompare(
            columnFilterValue(b[sortBy.name], false)[0] ??
              // istanbul ignore next
              "",
          );
  return ret;
}
