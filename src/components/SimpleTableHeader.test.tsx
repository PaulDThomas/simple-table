import { act, fireEvent, render, screen } from '@testing-library/react';
import { SimpleTableContext } from './SimpleTableContext';
import { SimpleTableHeader } from './SimpleTableHeader';
import { iSimpleTableField, iSimpleTableRow, iSimpleTableSort } from './interface';

jest.mock('./SimpleTableHeaderContents');

const mockSort = jest.fn();

const mockFields: iSimpleTableField[] = [
  { name: 'tlfId', hidden: true },
  {
    name: 'displayName',
    hidden: false,
    label: 'Name',
    sortFn: mockSort,
    width: '200px',
    canColumnFilter: true,
  },
  { name: 'description', hidden: false, label: 'Description' },
];

const mockData: iSimpleTableRow[] = [
  { TlfId: 1, displayName: 'Lead', description: 'Magic lead' },
  { TlfId: 2, displayName: 'Tester', description: 'A tester' },
  { TlfId: 3, displayName: 'Other user', description: 'Important VIP' },
];

const mockSortUp: iSimpleTableSort = { name: 'displayName', asc: true };
const mockSortDown: iSimpleTableSort = { name: 'description', asc: false };

const mockSorting = jest.fn();

describe('Simple table header renders', () => {
  test('No context render', async () => {
    render(
      <table>
        <thead>
          <tr>
            <SimpleTableHeader />
          </tr>
        </thead>
      </table>,
    );
    expect(screen.queryByText('Name')).not.toBeInTheDocument();
    expect(screen.queryByText('Description')).not.toBeInTheDocument();
  });

  test('Basic render', async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: 'testtable',
          fields: mockFields,
          keyField: 'userId',
          viewData: mockData,
          totalRows: mockData.length,
          firstRow: 0,
          pageRows: 50,
          sortBy: mockSortDown,
          columnWidths: [],
          currentColumnItems: [
            { columnName: 'displayName', values: ['Lead', 'Tester', 'Other user'] },
          ],
          currentColumnFilter: null,
          currentColumnFilters: [
            { columnName: 'displayName', values: ['Lead', 'Tester', 'Other user'] },
          ],
        }}
      >
        <table>
          <thead>
            <tr>
              <SimpleTableHeader />
            </tr>
          </thead>
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.getByText('0:displayName')).toBeInTheDocument();
    expect(screen.getByText('1:description')).toBeInTheDocument();
  });
});

describe('Resize table cell', () => {
  test('Resize', async () => {
    await act(async () => {
      render(
        <SimpleTableContext.Provider
          value={{
            id: 'testtable',
            fields: mockFields,
            keyField: 'userId',
            viewData: mockData,
            totalRows: mockData.length,
            sortBy: mockSortUp,
            firstRow: 0,
            pageRows: 50,
            updateSortBy: mockSorting,
            columnWidths: [],
            currentColumnItems: [
              { columnName: 'displayName', values: ['Lead', 'Tester', 'Other user'] },
            ],
            currentColumnFilter: null,
            currentColumnFilters: [
              { columnName: 'displayName', values: ['Lead', 'Tester', 'Other user'] },
            ],
          }}
        >
          <div data-testid='container'>
            <table>
              <thead>
                <tr>
                  <SimpleTableHeader />
                </tr>
              </thead>
            </table>
          </div>
        </SimpleTableContext.Provider>,
      );
    });
    const container = await screen.findByTestId('container');
    const cells = container.querySelectorAll('th');
    const rhs = container.querySelectorAll('th div.resize-handle');
    const th = cells[0];
    const rh = rhs[0];
    expect(th).toBeInTheDocument();
    expect(rh).toBeInTheDocument();
    fireEvent.mouseDown(rh);
    fireEvent.mouseMove(rh, { clientX: 300, clientY: 100 });
    fireEvent.mouseUp(rh);
    fireEvent.mouseDown(rh);
    fireEvent.mouseMove(rh, { clientX: -100, clientY: -100 });
    fireEvent.mouseUp(rh);
  });
});

describe('Custom render', () => {
  test('Custom render', async () => {
    await act(async () => {
      render(
        <SimpleTableContext.Provider
          value={{
            id: 'testtable',
            fields: [mockFields[0], { ...mockFields[1], headerRenderFn: () => <>Woot!</> }],
            keyField: 'userId',
            viewData: mockData,
            totalRows: mockData.length,
            sortBy: mockSortUp,
            firstRow: 0,
            pageRows: 50,
            updateSortBy: mockSorting,
            columnWidths: [],
            currentColumnItems: [
              { columnName: 'displayName', values: ['Lead', 'Tester', 'Other user'] },
            ],
            currentColumnFilter: null,
            currentColumnFilters: [
              { columnName: 'displayName', values: ['Lead', 'Tester', 'Other user'] },
            ],
          }}
        >
          <div data-testid='container'>
            <table>
              <thead>
                <tr>
                  <SimpleTableHeader />
                </tr>
              </thead>
            </table>
          </div>
        </SimpleTableContext.Provider>,
      );
    });
    expect(screen.queryByText('Woot!')).toBeInTheDocument();
  });
});
