import { Key, useState } from 'react';
import {
  iSimpleTableCellRenderProps,
  iSimpleTableField,
  iSimpleTableRow,
  SimpleTable,
} from '../../src/components';
import { mockData } from '../../src/__mocks__/mock_data';

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
      width: '100px',
    },
    {
      name: 'last_name',
      label: 'Surname',
      searchFn: (rowData, searchText) =>
        (rowData.last_name as string).toLowerCase().includes(searchText.toLowerCase().trim()),
      sortFn: (a, b) => (a.last_name as string).localeCompare(b.last_name as string),
      width: '120px',
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
      width: '160px',
    },
  ]);

  return (
    <div className='app-holder'>
      <div className='app-border'>
        <div className='app-inner'>
          <SimpleTable
            id='ais'
            fields={fields}
            keyField={'id'}
            data={data.slice(0, 200)}
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
    </div>
  );
};
export default App;
