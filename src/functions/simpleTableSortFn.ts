import { iSimpleTableRow, iSimpleTableSort } from '../components';

export const simpleTableSortFn = (
  a: iSimpleTableRow,
  b: iSimpleTableRow,
  sortBy: iSimpleTableSort,
) => {
  return typeof a[sortBy.name] === 'number' || typeof b[sortBy.name] === 'number'
    ? ((typeof a[sortBy.name] === 'number' ? a[sortBy.name] : -Infinity) as number) -
        ((typeof b[sortBy.name] === 'number' ? b[sortBy.name] : -Infinity) as number)
    : a[sortBy.name] instanceof Date || b[sortBy.name] instanceof Date
    ? ((a[sortBy.name] ?? new Date('0001-01-01')) as Date).getTime() -
      ((b[sortBy.name] ?? new Date('0001-01-01')) as Date).getTime()
    : ((a[sortBy.name] ?? '') as string).localeCompare((b[sortBy.name] ?? '') as string);
};
