import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { iSimpleTableField, iSimpleTableRow } from '../components/interface';
import { SimpleTableContext } from '../components/SimpleTableContext';
import { SimpleTableSearch } from '../components/SimpleTableSearch';

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
          tableData: mockData,
          searchText: 'Hello',
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
          tableData: mockData,
          searchLabel: 'BIG SEARCH',
          setSearchText: mockSetSearch,
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
