import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { iSimpleTableField, iSimpleTableRow, iSimpleTableSort } from '../components/interface';
import { SimpleTableContext } from '../components/SimpleTableContext';
import { SimpleTableHeader } from '../components/SimpleTableHeader';

const mockSort = jest.fn();

const mockFields: iSimpleTableField[] = [
  { name: 'tlfId', hidden: true },
  { name: 'displayName', hidden: false, label: 'Name', sortFn: mockSort, width: '200px' },
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
          tableData: mockData,
          sortBy: mockSortDown,
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
          tableData: mockData,
          sortBy: mockSortUp,
          updateSortBy: mockSorting,
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
    expect(mockSorting).toHaveBeenCalledWith(mockFields[2]);
  });
});

describe('Resize table cell', () => {
  test('Resize', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SimpleTableContext.Provider
        value={{
          id: 'testtable',
          fields: mockFields,
          keyField: 'userId',
          viewData: mockData,
          tableData: mockData,
          sortBy: mockSortUp,
          updateSortBy: mockSorting,
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
    const rhs = container.querySelectorAll('th div.resize-handle');
    const rh = rhs[0];
    expect(rh).toBeInTheDocument();
    fireEvent.mouseDown(rh);
    fireEvent.mouseMove(rh, { clientX: '300px', clientY: '100px' });
    fireEvent.mouseUp(rh);
  });
});
