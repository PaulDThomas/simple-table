[npm]: https://img.shields.io/npm/v/@asup/simple-table
[npm-url]: https://www.npmjs.com/package/@asup/simple-table
[size]: https://packagephobia.now.sh/badge?p=@asup/simple-table
[size-url]: https://packagephobia.now.sh/result?p=@asup/simple-table

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/PaulDThomas/simple-table/master/LICENCE)

# @asup/simple-table

REACT table, because I wanted one that took an array of objects as an input. Sort, filter and search functions can be added. Includes column resize.

## Installation

```
# with npm
npm install @asup/simple-table
```

## Usage

```ts
import {
  ISimpleTableField,
  ISimpleTableSort,
  ISimpleTableSortFn,
  SimpleTable,
  simpleTableSortFn,
} from "@asup/simple-table";
```

... inside REACT component

```tsx
<SimpleTable
  id: string;
  headerLabel?: string;
  fields: ISimpleTableField<T>[];
  keyField: keyof T;
  data: T[];
  selectable?: boolean;
  currentSelection?: Key[];
  setCurrentSelection?: (ret: Key[]) => void;
  showSearch?: boolean;
  showFilter?: boolean;
  showPager?: boolean;
  initialFilterSelected?: boolean;
  filterLabel?: string;
  searchLabel?: string;
  onWidthChange?: (ret: { name: keyof T; width: string }[]) => void;
  onPagerChange?: (ret: {firstRow: number; pageRows: number}) => void
  tableClassName?: string;
  inputGroupClassName?: string;
  filterLabelClassName?: string;
  filterCheckClassName?: string;
  searchLabelClassName?: string;
  searchInputClassName?: string;
  headerBackgroundColor?: string;
/>
```

## Properties

| Prop                     | Description                                                                                            |            Default             |
| :----------------------- | :----------------------------------------------------------------------------------------------------- | :----------------------------: |
| id                       | Unique row id                                                                                          |         `simple-table`         |
| headerLabel              | Title used in the at the top of the table                                                              |         'Simple table'         |
| fields                   | List of columns in the table                                                                           |                                |
| keyField                 | Field containing the unique key for each row                                                           |                                |
| data                     | Data to display, must contain a unique key field                                                       |                                |
| selectable               | Indicates if rows can be selected, using a checkbox                                                    |            `false`             |
| currentSelection         | Currently selected row keys                                                                            |                                |
| setCurrentSelection      | Function to update the selected row keys, must be used in conjunction with the selectable indicator    |                                |
| showSearch               | Indicates whether to show the search input. All fields with a defined search function will be searched |             `true`             |
| showFilter               | Indicates whether to show the filter checkbox                                                          |            `false`             |
| showPager                | Indicates whether to show the pager in the footer.                                                     |             `true`             |
| initialFilterSelected    | Indicates whether the filter checkbox is checked on the initial render                                 |            `false`             |
| filterLabel              | Label for the filter checkbox                                                                          |            'Filter'            |
| searchLabel              | Label for the search input                                                                             |            'Search'            |
| onWidthChange            | Callback after changing column widths by dragging                                                      |                                |
| onPagerChange            | Callback after changing pager                                                                          |
| tableClassName           | Class names to apply to the table element.                                                             |               ''               |
| ~~inputGroupClassName~~  | Not currently implemented                                                                              |          `form-group`          |
| ~~filterLabelClassName~~ | Not currently implemented                                                                              |       `form-check-label`       |
| filterCheckClassName     | Class names to apply to the checkboxes in the table. The default works well with bootstrap 5.2         |       `form-check-input`       |
| searchLabelClassName     | Class names to apply to the search label. The default works well with bootstrap 5.2                    |          `form-label`          |
| searchInputClassName     | Class names to apply to the search input. The default works well with bootstrap 5.2                    | `form-control form-control-sm` |
| mainBackgroundColor      | Background colour applied                                                                              |            `white`             |
| headerBackgroundColor    | Background colour applied to the header row, used when other rows scroll under it                      |            `white`             |

### Input data

Input data should be an array of objects

```ts
interface PersonRow {
  id: number;
  first_name: string;
  last_name: string;
  car_make: string | null;
}
```

e.g.

```
{
  id: 2,
  first_name: 'Paul',
  last_name: 'Thomas',
  car_make: 'Lotus',
},
```

Complex objects are supported. If you need custom formatting for sorting/filtering/rendering, provide the field callbacks.

You do not need to extend a base interface. Any object shape works.

### Column definition

Specify the fields to use in the table in the following format

```ts
interface ISimpleTableField<T> {
  name: keyof T;
  label?: string;
  hidden?: boolean;
  width?: string;
  sortFn?: (a: T, b: T, sortBy: ISimpleTableSort<T>) => number;
  searchFn?: (a: T, searchText: string) => boolean;
  filterOutFn?: (a: T) => boolean;
  headerRenderFn?: (a: ISimpleTableHeaderRenderProps<T>) => JSX.Element;
  renderFn?: (a: ISimpleTableCellRenderProps<T>) => JSX.Element;
}
```

e.g.

```ts
interface PersonRow {
  id: number;
  first_name: string;
  car_make: string | null;
}

const fields: ISimpleTableField<PersonRow>[] = [
  { name: 'id', hidden: true },
  {
    name: 'first_name',
    label: 'First name',
    searchFn: (rowData, searchText) =>
      rowData.first_name.toLowerCase().includes(searchText.toLowerCase().trim()),
    sortFn: simpleTableSortFn,
  },
  ...,
  {
    name: 'car_make',
    label: 'Make',
    searchFn: (rowData, searchText) =>
      (rowData.car_make ?? '')
        .toLowerCase()
        .includes(searchText.toLowerCase().trim()),
    sortFn: simpleTableSortFn,
    renderFn: ({ rowData }) => {
      return rowData.car_make ? <div>{rowData.car_make}</div> : <div>No car</div>;
    },
    filterOutFn: (rowData) => rowData.car_make === null,
  },
  ...,
];
```

### Column header search and filter

When generating options for column header filters, the table automatically handles arrays and objects by inspecting individual values. Array elements are each treated as a separate option; plain objects use their string representation. No custom conversion function is needed.

### Filter out function

Specify how an each row should be filtered when the filter box is checked, on a field by field basis.
Should return a truthy or falsy value. **NB** A true value will remove the row.

```
const filterOutFn = (rowData: PersonRow) => rowData.car_make === null;
```

### Search function

Specify how an each row should be compared against the text in the search box, on a field by field basis.
Should return a truthy or falsy value.

```
const searchFn = (rowData: PersonRow, searchText: string) => {
  return (rowData.car_make ?? '').toLowerCase().includes(searchText.toLowerCase().trim());
};
```

### Sort function

Specify a column sort function, where `sortBy` returns the name and sort direction returned.  
**NB** do not use the sort direction in the sorting algorithm, this will be applied by the table, however it is available for reference.

```ts
const sortFn: ISimpleTableSortFn<PersonRow> = (a, b, sortBy) => {
  return String(a[sortBy.name]).localeCompare(String(b[sortBy.name]));
};

// Default sort helper can be used directly.
const fieldsWithDefaultSort: ISimpleTableField<PersonRow>[] = [
  { name: "first_name", label: "First name", sortFn: simpleTableSortFn },
  { name: "car_make", label: "Make", sortFn: simpleTableSortFn },
];
```

## Header Cell and Body Cell rendering

If no custom render function for the field is specified for the cell or the header, then the field will be rendered as a string.

A custom render function can be supplied to alter this, which is supplied with the column number, field name and row data as an object. It must return a valid JSX element.

```ts
interface ISimpleTableHeaderRenderProps<T> {
  columnNumber: number;
  field: ISimpleTableField<T>;
}

interface ISimpleTableCellRenderProps<T> extends ISimpleTableHeaderRenderProps<T> {
  cellField: keyof T;
  rowData: T;
  rowNumber: number;
}
```

e.g.

```
const headerRenderFn({ columnNumber, field }) => (
  <>
    {columnNumber}:{' '}
    <span>
      {field.name}
    </span>
  </>
);

const renderFn = ({ columnNnumber, cellField, rowData }:ISimpleTableCellRenderProps):JSX.Element => {
  return rowData.car_make ? <div>{rowData.car_make as string}</div> : <div>No car</div>;
};
```

# VS code launch settings

Use these configurations to attach to chrome, then launch Storybook

```
"configurations": [
  {
    "type": "chrome",
    "request": "attach",
    "port": 9222,
    "name": "Attach to Browser debug",
    "webRoot": "${workspaceFolder}",
    "sourceMapPathOverrides": {
      "/__parcel_source_root/*": "${webRoot}/*"
    }
  },
  {
    "name": "Launch Storybook",
    "command": "npm run storybook",
    "request": "launch",
    "type": "node-terminal",
    "cwd": "${workspaceRoot}",
    "serverReadyAction": {
      "pattern": "Local:\\s+(http://localhost:[0-9]+/?)+",
      "uriFormat": "%s",
      "action": "openExternally"
    }
  }
]
```
