import React, { Key, useState } from 'react';
import {
  iSimpleTableCellRenderProps,
  iSimpleTableField,
  iSimpleTableRow,
} from './components/interface';
import { SimpleTable } from './components/SimpleTable';
import { mockData } from './mock_data';

// Main application
const App = (): JSX.Element => {
  const [data] = useState<iSimpleTableRow[]>(mockData);
  const [selected, setSelected] = useState<Key[]>([]);

  const [fields] = useState<iSimpleTableField[]>([
    { name: 'id', hidden: true },
    {
      name: 'first_name',
      label: 'First name',
      searchFn: (rowData, searchText) =>
        (rowData.first_name as string).toLowerCase().includes(searchText.toLowerCase().trim()),
      sortFn: (a, b) => (a.first_name as string).localeCompare(b.first_name as string),
    },
    {
      name: 'last_name',
      label: 'Surname',
      searchFn: (rowData, searchText) =>
        (rowData.last_name as string).toLowerCase().includes(searchText.toLowerCase().trim()),
      sortFn: (a, b) => (a.last_name as string).localeCompare(b.last_name as string),
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
    },
    {
      name: 'car_model',
      label: 'Model',
      searchFn: (rowData, searchText) =>
        ((rowData.car_model as string | null) ?? '')
          .toLowerCase()
          .includes(searchText.toLowerCase().trim()),
      sortFn: (a, b) =>
        ((a.car_model as string | null) ?? '').localeCompare((b.car_model as string | null) ?? ''),
      renderFn: ({ rowData }: iSimpleTableCellRenderProps) => {
        return rowData.car_model ? <div>{rowData.car_model as string}</div> : <div>&nbsp;</div>;
      },
    },
  ]);

  return (
    <div
      className='holder'
      style={{}}
    >
      <div
        className=''
        style={{
          width: '800px',
          border: '1px black solid',
          backgroundColor: 'white',
          opacity: 1,
          paddingLeft: '1rem',
          paddingRight: '1rem',
          marginTop: '1rem',
          marginBottom: '1rem',
          borderRadius: '0.5rem',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <SimpleTable
          id='ais'
          fields={fields}
          keyField={'id'}
          data={data}
          headerLabel='Demo table'
          showSearch
          showFilter
          filterLabel='Cars only'
          selectable
          currentSelection={selected}
          setCurrentSelection={setSelected}
        />
      </div>
    </div>
  );
};
export default App;
