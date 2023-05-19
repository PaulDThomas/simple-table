import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { iSimpleTableField, iSimpleTableRow, iSimpleTableSort } from '../components/interface';
import { SimpleTableContext } from '../components/SimpleTableContext';
import { SimpleTableHeader } from '../components/SimpleTableHeader';

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
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  test('Test sorting clicks', async () => {
    const user = userEvent.setup();
    const { container } = render(
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
        <table>
          <thead>
            <tr>
              <SimpleTableHeader />
            </tr>
          </thead>
        </table>
      </SimpleTableContext.Provider>,
    );
    const cells = container.querySelectorAll('th');
    expect(cells.length).toEqual(2);

    await user.click(screen.getByText('Name'));
    expect(mockSorting).toHaveBeenCalledWith(mockFields[1]);

    await user.click(screen.getByText('Description'));
    expect(mockSorting).not.toHaveBeenCalledWith(mockFields[2]);
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
    // expect(th.style.width).toEqual('400px');
    fireEvent.mouseDown(rh);
    fireEvent.mouseMove(rh, { clientX: -100, clientY: -100 });
    fireEvent.mouseUp(rh);
    // expect(th.style.width).toEqual('16px');
  });
});

describe('Filter on column values', () => {
  test('Display all filter', async () => {
    const user = userEvent.setup();
    const mockSet = jest.fn();
    const mockSetCurrentFilter = jest.fn();
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
            setCurrentColumnFilter: mockSetCurrentFilter,
            currentColumnFilters: [
              { columnName: 'displayName', values: ['Lead', 'Tester', 'Other user'] },
            ],
            setCurrentColumnFilters: mockSet,
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
    const filter = screen.getByLabelText('Column filter');
    const selectTester = screen.getByLabelText('Tester');
    expect(filter).toBeInTheDocument();
    expect(selectTester).toBeInTheDocument();
    expect(selectTester).not.toBeVisible();
    await user.click(filter);
    expect(mockSetCurrentFilter).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentFilter).toHaveBeenCalledWith(0);
  });
  test('Display partial filter', async () => {
    const user = userEvent.setup();
    const mockSet = jest.fn();
    const mockSetCurrentFilter = jest.fn();
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
            currentColumnFilter: 0,
            setCurrentColumnFilter: mockSetCurrentFilter,
            currentColumnFilters: [{ columnName: 'displayName', values: ['Tester'] }],
            setCurrentColumnFilters: mockSet,
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
    const filter = screen.getByLabelText('Column filter (Active)');
    const selectTester = screen.getByLabelText('Tester');
    expect(filter).toBeInTheDocument();
    expect(selectTester).toBeInTheDocument();
    expect(selectTester).toBeVisible();
    await user.click(filter);
    expect(mockSetCurrentFilter).toBeCalledTimes(1);
    expect(mockSetCurrentFilter).toBeCalledWith(null);
    expect(screen.queryByText('1 item selected')).toBeInTheDocument();
  });
});
