import { Key, useState } from 'react';
import { mockData } from '../../src/__mocks__/mock_data';
import { mock_fields } from '../../src/__mocks__/mock_fields';
import { SimpleTable, iSimpleTableRow } from '../../src/components';

// Main application
const App = (): JSX.Element => {
  const [data, setData] = useState<iSimpleTableRow[]>(mockData);
  const [selected, setSelected] = useState<Key[]>([]);
  const [height, setHeight] = useState<string>('800px');
  const [width, setWidth] = useState<string>('600px');
  const [title, setTitle] = useState<string>('');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const [showPager, setShowPager] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(true);

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
                      onChange={() => setShowSearch(!showSearch)}
                    />
                    &nbsp;&nbsp;&nbsp; Filter:{' '}
                    <input
                      type='checkbox'
                      checked={showFilter}
                      onChange={() => setShowFilter(!showFilter)}
                    />
                    &nbsp;&nbsp;&nbsp; Pager:{' '}
                    <input
                      type='checkbox'
                      checked={showPager}
                      onChange={() => setShowPager(!showPager)}
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
              fields={mock_fields}
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
