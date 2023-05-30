import { fireEvent, render, screen } from '@testing-library/react';
import { iSimpleTableField, iSimpleTableRow } from '../components/interface';
import { SimpleTableContext } from '../components/SimpleTableContext';
import { SimpleTableSelectHeader } from '../components/SimpleTableSelectHeader';

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

const mockToggle = jest.fn();

describe('Simple table header checkbox rendering', () => {
  test('Unchecked render', async () => {
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
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <thead>
            <tr>
              <SimpleTableSelectHeader />
            </tr>
          </thead>
        </table>
      </SimpleTableContext.Provider>,
    );
    const check = screen.getByRole('checkbox');
    expect(check).not.toBeChecked();
  });

  test('Checked render', async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: 'testtable',
          fields: mockFields,
          keyField: 'userId',
          viewData: mockData,
          totalRows: mockData.length,
          selectable: true,
          firstRow: 0,
          pageRows: 50,
          currentSelection: [1, 2, 3, 'four'],
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <thead>
            <tr>
              <SimpleTableSelectHeader />
            </tr>
          </thead>
        </table>
      </SimpleTableContext.Provider>,
    );
    const check = screen.getByRole('checkbox');
    expect(check).toBeChecked();
  });

  test('Indeterminate render', async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: 'testtable',
          fields: mockFields,
          keyField: 'userId',
          viewData: mockData.slice(0, 1),
          totalRows: 1,
          firstRow: 0,
          pageRows: 50,
          selectable: true,
          currentSelection: [1, 2],
          toggleAllCurrentSelection: mockToggle,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <thead>
            <tr>
              <SimpleTableSelectHeader />
            </tr>
          </thead>
        </table>
      </SimpleTableContext.Provider>,
    );
    const check = screen.getByRole('checkbox');
    expect((check as HTMLInputElement).indeterminate).toEqual(true);
    await fireEvent.click(check);
    expect(mockToggle).toHaveBeenCalled();
  });
});
