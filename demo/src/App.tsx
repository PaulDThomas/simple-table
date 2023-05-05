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
  // const [data] = useState<iSimpleTableRow[]>(
  //   [...mockData, ...mockData, ...mockData, ...mockData, ...mockData].map((r, i) => {
  //     return { ...r, id: i };
  //   }),
  // );
  const [data, setData] = useState<iSimpleTableRow[]>(mockData);
  const [selected, setSelected] = useState<Key[]>([]);
  const [height, setHeight] = useState<string>('800px');
  const [width, setWidth] = useState<string>('600px');
  const [title, setTitle] = useState<string>('');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [showPager, setShowPager] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(true);

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
      // sortFn: (a, b) =>
      //   ((a.car_make as string | null) ?? '').localeCompare((b.car_make as string | null) ?? ''),
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
          <div>
            <table>
              <tbody>
                <tr>
                  <td>Height</td>
                  <td>
                    <input
                      value={height}
                      onChange={(e) => setHeight(e.currentTarget.value)}
                    />
                  </td>
                  <td>Width</td>
                  <td>
                    <input
                      value={width}
                      onChange={(e) => setWidth(e.currentTarget.value)}
                    />
                  </td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>Title</td>
                  <td>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.currentTarget.value)}
                    />
                  </td>
                  <td>
                    Search:{' '}
                    <input
                      type='checkbox'
                      checked={showSearch}
                      onClick={() => setShowSearch(!showSearch)}
                    />
                    &nbsp;&nbsp;&nbsp; Filter:{' '}
                    <input
                      type='checkbox'
                      checked={showFilter}
                      onClick={() => setShowFilter(!showFilter)}
                    />
                    &nbsp;&nbsp;&nbsp; Pager:{' '}
                    <input
                      type='checkbox'
                      checked={showPager}
                      onClick={() => setShowPager(!showPager)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setData(data.filter((r) => !selected.includes(r.id as Key)));
                      }}
                    >
                      Remove selected
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            className='table-holder'
            style={{ backgroundColor: 'cyan', height, width, maxWidth: '800px', padding: '1rem' }}
          >
            <SimpleTable
              id='ais'
              fields={fields}
              keyField={'id'}
              data={data}
              headerLabel={title}
              showSearch={showSearch}
              showFilter={showFilter}
              showPager={showPager}
              filterLabel='Cars only'
              selectable
              currentSelection={selected}
              setCurrentSelection={setSelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
