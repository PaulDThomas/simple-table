import { ISimpleTableRow, ISimpleTableSort } from "../components";
import { columnFilterValue } from "./columnFilterValue";

export const simpleTableSortFn = (
  a: ISimpleTableRow,
  b: ISimpleTableRow,
  sortBy: ISimpleTableSort,
) => {
  const ret =
    typeof a[sortBy.name] === "number" || typeof b[sortBy.name] === "number"
      ? ((typeof a[sortBy.name] === "number" ? a[sortBy.name] : -Infinity) as number) -
        ((typeof b[sortBy.name] === "number" ? b[sortBy.name] : -Infinity) as number)
      : a[sortBy.name] instanceof Date && b[sortBy.name] instanceof Date
        ? (a[sortBy.name] as Date).getTime() - (b[sortBy.name] as Date).getTime()
        : columnFilterValue(a[sortBy.name], false).localeCompare(
            columnFilterValue(b[sortBy.name], false),
          );
  return ret;
};
