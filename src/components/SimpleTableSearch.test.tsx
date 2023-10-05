import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { iSimpleTableField, iSimpleTableRow } from './interface';
import { SimpleTableContext } from './SimpleTableContext';
import { SimpleTableSearch } from './SimpleTableSearch';

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

const mockSetSearch = jest.fn();

describe('Simple table search rendering', () => {
  test('Initial render', async () => {
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
          searchText: 'Hello',
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <SimpleTableSearch />
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText('Search')).toBeInTheDocument();
    const searchField = screen.getByRole('searchbox');
    expect(searchField).toHaveValue('Hello');
  });

  test('Render and type', async () => {
    const user = userEvent.setup();
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
          searchLabel: 'BIG SEARCH',
          setSearchText: mockSetSearch,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <SimpleTableSearch />
      </SimpleTableContext.Provider>,
    );
    const searchField = screen.getByRole('searchbox');
    await user.type(searchField, 'search');
    expect(mockSetSearch).toHaveBeenCalledTimes(6);
  });
});
