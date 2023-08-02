import { iSimpleTableField, simpleTableSortFn } from '../main';

export const mock_fields: iSimpleTableField[] = [
  { name: 'id', hidden: true },
  {
    name: 'first_name',
    label: 'First name',
    searchFn: (rowData, searchText) =>
      (rowData.first_name as string).toLowerCase().includes(searchText.toLowerCase().trim()),
    sortFn: simpleTableSortFn,
    width: '100px',
  },
  {
    name: 'last_name',
    label: 'Surname',
    searchFn: (rowData, searchText) =>
      (
        `${
          rowData.last_name instanceof Date ? rowData.last_name.toDateString() : rowData.last_name
        }` as string
      )
        .toLowerCase()
        .includes(searchText.toLowerCase().trim()),
    sortFn: (a, b) => (a.last_name as string).localeCompare(b.last_name as string),
    width: '120px',
    canColumnFilter: true,
  },
  {
    name: 'car_make',
    label: 'Make',
    searchFn: (rowData, searchText) =>
      ((rowData.car_make as string | null) ?? '')
        .toLowerCase()
        .includes(searchText.toLowerCase().trim()),
    sortFn: (a, b) =>
      ((a.car_make as string | null) ?? '').localeCompare((b.car_make as string | null) ?? ''),
    renderFn: ({ rowData }) => {
      return rowData.car_make ? <div>{rowData.car_make as string}</div> : <div>No car</div>;
    },
    filterOutFn: (rowData) => (rowData.car_make as string | null) === null,
    width: '140px',
    canColumnFilter: true,
  },
  {
    name: 'car_model',
    label: 'Model',
    searchFn: (rowData, searchText) =>
      ((rowData.car_model as string | null) ?? '')
        .toLowerCase()
        .includes(searchText.toLowerCase().trim()),
    sortFn: simpleTableSortFn,
    renderFn: ({ rowData }) => {
      return rowData.car_model ? <div>{rowData.car_model as string}</div> : <div>&nbsp;</div>;
    },
    width: '160px',
    canColumnFilter: true,
  },
];
