import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SimpleTableColumnFilter } from '../components/SimpleTableColumnFilter';
import { SimpleTableContext } from '../components/SimpleTableContext';
import { iSimpleTableField, iSimpleTableRow } from '../components/interface';

const mockFields: iSimpleTableField[] = [
  { name: 'userId', hidden: true, label: 'UserId' },
  { name: 'displayName', label: 'Display name' },
];

const mockData: iSimpleTableRow[] = [
  { userId: 1, displayName: 'User 1' },
  { userId: 2, displayName: 'User 2' },
  { userId: 3, displayName: 'User 3' },
  { userId: 'four', displayName: 'Another user' },
];

describe('Simple table column filter rendering', () => {
  test('Basic render', async () => {
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
            firstRow: 0,
            pageRows: 50,
            selectable: true,
            columnWidths: [],
            currentColumnItems: [
              { columnName: 'displayName', values: ['Lead', 'Tester', 'Other user'] },
            ],
            currentColumnFilter: 0,
            setCurrentColumnFilter: mockSetCurrentFilter,
            currentColumnFilters: [
              { columnName: 'displayName', values: ['Lead', 'Tester', 'Other user'] },
            ],
            setCurrentColumnFilters: mockSet,
          }}
        >
          <SimpleTableColumnFilter columnName={'displayName'} />
        </SimpleTableContext.Provider>,
      );
    });
    expect(screen.queryByText('3 items selected')).toBeInTheDocument();
    expect(screen.queryByLabelText('Column filter search')).toBeInTheDocument();
    expect(screen.queryByLabelText('Column filter toggle')).toBeInTheDocument();
    expect(screen.queryByLabelText('Tester')).toBeInTheDocument();
    await user.click(screen.queryByLabelText('Column filter toggle') as HTMLInputElement);
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith([{ columnName: 'displayName', values: [] }]);
    await user.click(screen.queryByLabelText('Close filter') as Element);
    expect(mockSetCurrentFilter).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentFilter).toHaveBeenCalledWith(null);
  });

  test('Add to filter', async () => {
    const user = userEvent.setup();
    await act(async () => {
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
            selectable: true,
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
          <SimpleTableColumnFilter columnName={'displayName'} />
        </SimpleTableContext.Provider>,
      );
    });
    const search = screen.queryByLabelText('Column filter search') as HTMLInputElement;
    expect(screen.queryByLabelText('Lead')).toBeInTheDocument();
    await user.type(search, 'Te');
    expect(screen.queryByLabelText('Lead')).not.toBeInTheDocument();
  });
});

describe('Update filter', () => {
  test('Uncheck boxes', async () => {
    const user = userEvent.setup();
    let cf = [{ columnName: 'displayName', values: ['Lead'] }];
    const mockSet = jest.fn((newCf) => {
      cf = newCf;
    });
    await act(async () => {
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
            selectable: true,
            columnWidths: [],
            currentColumnItems: [
              { columnName: 'displayName', values: ['Lead', 'Tester', 'Other user'] },
            ],
            currentColumnFilter: null,
            currentColumnFilters: cf,
            setCurrentColumnFilters: mockSet,
          }}
        >
          <SimpleTableColumnFilter columnName={'displayName'} />
        </SimpleTableContext.Provider>,
      );
    });
    const lead = screen.getByLabelText('Lead');
    const tester = screen.getByLabelText('Tester');
    await user.click(lead);
    expect(mockSet).toHaveBeenLastCalledWith([{ columnName: 'displayName', values: [] }]);
    await user.click(tester);
    expect(mockSet).toHaveBeenLastCalledWith([
      { columnName: 'displayName', values: ['Lead', 'Tester'] },
    ]);
  });
});

describe('Update toggle', () => {
  test('Check all', async () => {
    const user = userEvent.setup();
    const mockSet = jest.fn();
    await act(async () => {
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
            selectable: true,
            columnWidths: [],
            currentColumnItems: [
              { columnName: 'displayName', values: ['Lead', 'Tester', 'Other user'] },
            ],
            currentColumnFilter: null,
            currentColumnFilters: [],
            setCurrentColumnFilters: mockSet,
          }}
        >
          <SimpleTableColumnFilter columnName={'displayName'} />
        </SimpleTableContext.Provider>,
      );
    });
    // const lead = screen.getByLabelText('Lead');
    // const tester = screen.getByLabelText('Tester');
    const all = screen.getByLabelText('Column filter toggle');
    // const other = screen.getByLabelText('Other user');
    await user.click(all);
    expect(mockSet).toHaveBeenLastCalledWith([
      { columnName: 'displayName', values: ['Lead', 'Other user', 'Tester'] },
    ]);
    // await user.click(tester);
    // expect(mockSet).toHaveBeenLastCalledWith([
    //   { columnName: 'displayName', values: ['Lead', 'Tester'] },
    // ]);
  });
});
