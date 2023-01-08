[npm]: https://img.shields.io/npm/v/@asup/simple-table
[npm-url]: https://www.npmjs.com/package/@asup/simple-table
[size]: https://packagephobia.now.sh/badge?p=@asup/simple-table
[size-url]: https://packagephobia.now.sh/result?p=@asup/simple-table

[![npm][npm]][npm-url]
[![size][size]][size-url]
![npm bundle size](https://img.shields.io/bundlephobia/min/@asup/simple-table)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/PaulDThomas/tree-of-nodes/master/LICENCE)

# @asup/simple-table

REACT table, because I wanted one that took an array of objects as an input. Sort, filter and search functions can be added. Includes column resize.

## Installation

```
# with npm
npm install @asup/simple-table
```

## Usage

```
import { iSimpleTableField, iSimpleTableRow, iSimpleTableSort, SimpleTable } from '@asup/simple-table';
```

... inside REACT component

```
  <SimpleTable
    id?: string;
    headerLabel?: string;
    fields: iSimpleTableField[];
    keyField: string;
    data: iSimpleTableRow[];
    selectable?: boolean;
    currentSelection?: Key[];
    setCurrentSelection?: (ret: Key[]) => void;
    showSearch?: boolean;
    showFilter?: boolean;
    initialFilterSelected?: boolean;
    filterLabel?: string;
    searchLabel?: string;
    tableClassName?: string;
    inputGroupClassName?: string;
    filterLabelClassName?: string;
    filterCheckClassName?: string;
    searchLabelClassName?: string;
    searchInputClassName?: string;
    headerBackgroundColor?: string;
    firstColumnBackgroundColor?: string;
  />
```

## Properties

| Prop                       | Description                                                                                            |                           Default                           |
| :------------------------- | :----------------------------------------------------------------------------------------------------- | :---------------------------------------------------------: |
| id                         | Unique row id                                                                                          |                       `simple-table`                        |
| headerLabel                | Title used in the at the top of the table                                                              |                       'Simple table'                        |
| fields                     | List of columns in the table                                                                           |                                                             |
| keyField                   | Field containing the unique key for each row                                                           |                                                             |
| data                       | Data to display, must contain a unique key field                                                       |                                                             |
| selectable                 | Indicates if rows can be selected, using a checkbox                                                    |                                                             |
| currentSelection           | Currently selected row keys                                                                            |                                                             |
| setCurrentSelection        | Function to update the selected row keys, must be used in conjunction with the selectable indicator    |                                                             |
| showSearch                 | Indicates whether to show the search input. All fields with a defined search function will be searched |                                                             |
| searchLabel                | Label for the search input                                                                             |                          'Search'                           |
| showFilter                 | Indicates whether to show the filter checkbox                                                          |                                                             |
| initialFilterSelected      | Indicates whether the filter checkbox is checked on the initial render                                 |                                                             |
| filterLabel                | Label for the filter checkbox                                                                          |                          'Filter'                           |
| tableClassName             | Class names to apply to the table element. The default works well with bootstrap 5.2                   | `simpletable table table-responsive table-striped table-sm` |
| ~~inputGroupClassName~~    | Not currently implemented                                                                              |                        `form-group`                         |
| ~~filterLabelClassName~~   | Not currently implemented                                                                              |                     `form-check-label`                      |
| filterCheckClassName       | Class names to apply to the checkboxes in the table. The default works well with bootstrap 5.2         |                     `form-check-input`                      |
| searchLabelClassName       | Class names to apply to the search label. The default works well with bootstrap 5.2                    |                        `form-label`                         |
| searchInputClassName       | Class names to apply to the search input. The default works well with bootstrap 5.2                    |               `form-control form-control-sm`                |
| headerBackgroundColor      | Background colour applied to the header row, used when other rows scroll under it                      |                           `white`                           |
| firstColumnBackgroundColor | Background colour applied to the first column (+ seletor), used when other columns scroll under it     |                           `white`                           |

### Input data

Input data should be an array of objects

```
interface iSimpleTableRow {
  [key: string]: unknown;
}
```

e.g.

```
  {
    id: 2,
    first_name: 'Paul',
    last_name: 'Thomas',
    car_make: 'Ferrari',
    car_model: 'Penis extension',
  },

```

however, there are no restrictions on data type for each element. Complex objects will require a render function to be supplied, and sort/search/filter functions if they are required.

### Column definition

Specify the fields to use in the table in the following format

```
interface iSimpleTableField {
    name: string;
    label?: string;
    hidden?: boolean;
    sortFn?: (a: iSimpleTableRow, b: iSimpleTableRow, sortBy: iSimpleTableSort) => number;
    searchFn?: (a: iSimpleTableRow, searchText: string) => boolean;
    filterOutFn?: (a: iSimpleTableRow) => boolean;
    renderFn?: (a: iSimpleTableCellRenderProps) => JSX.Element;
}
```

e.g.

```
const fields: iSimpleTableField[] = [
    { name: 'id', hidden: true },
    {
      name: 'first_name',
      label: 'First name',
      searchFn: (rowData, searchText) =>
        (rowData.first_name as string).toLowerCase().includes(searchText.toLowerCase().trim()),
      sortFn: (a, b) => (a.first_name as string).localeCompare(b.first_name as string),
    },
    ...,
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
    },
    ...,
];
```

### Sort function

Specify a column sort function, where `sortBy` returns the name and sort direction returned.  
**NB** do not use the sort direction in the sorting algorithm, this will be applied by the table, however it is available for reference.

```
const sortFn = (a: iSimpleTableRow, b: iSimpleTableRow, sortBy: iSimpleTableSort) => {
  return (a[sortBy.name] as string).localeCompare(b[sortBy.name] as string);
};
```

### Search function

Specify how an each row should be compared against the text in the search box, on a field by field basis.
Should return a truthy or falsy value.

```
const searchFn = (rowData: iSimpleTableRow, searchText: string) => {
  return ((rowData.car_make as string | null) ?? '').toLowerCase().includes(searchText.toLowerCase().trim());
};
```

### Filter out function

Specify how an each row should be filtered when the filter box is checked, on a field by field basis.
Should return a truthy or falsy value. **NB** A true value will remove the row.

```
const filterOutFn = (rowData: iSimpleTableRow) => { return (rowData.car_make as string | null) === null; };
```

## Cell rendering

If no custom render function for the field is specified, then the field will be rendered as a string.

A custom render function can be supplied to alter this, which is supplied with the column number, field name and row data as an object. It must return a valid JSX element.

```
interface iSimpleTableCellRenderProps {
  columnNumber: number;
  cellField: string;
  rowData: iSimpleTableRow;
}
```

e.g.

```
const renderFn = ({ columnNnumber, cellField, rowData }:iSimpleTableCellRenderProps):JSX.Element => {
  return rowData.car_make ? <div>{rowData.car_make as string}</div> : <div>No car</div>;
});
```

# VS code launch settings

Use these configurations to attach to chrome, then launch the server

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
      "name": "Launch NPM web server",
      "command": "npm start",
      "request": "launch",
      "type": "node-terminal",
      "cwd": "${workspaceRoot}",
      "env": {
        "PORT": "3010"
      },
      "serverReadyAction": {
        "pattern": "Server running at (http://localhost:[0-9]+)",
        "uriFormat": "%s",
        "action": "openExternally"
      }
    }
```
