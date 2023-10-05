import { render, screen } from '@testing-library/react';
import { iSimpleTableField, iSimpleTableRow } from './interface';
import { SimpleTableBody } from './SimpleTableBody';
import { SimpleTableContext } from './SimpleTableContext';

const mockFields: iSimpleTableField[] = [
  { name: 'tlfId', hidden: true },
  { name: 'displayName', hidden: false, label: 'Name' },
  { name: 'description', label: 'Description' },
];

const mockData: iSimpleTableRow[] = [
  { tlfId: 1, displayName: 'Lead', description: 'Magic lead' },
  { tlfId: 2, displayName: 'Tester', description: 'A tester' },
  { tlfId: 3, displayName: 'Other user', description: 'Important VIP' },
];

describe('Simple table body rendering', () => {
  test('No context render', async () => {
    render(
      <table>
        <SimpleTableBody />
      </table>,
    );
    expect(screen.queryByText('PRID')).not.toBeInTheDocument();
  });

  test('Bad keyfield render', async () => {
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
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <SimpleTableBody />
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryAllByText('keyField has not been found').length).toEqual(3);
  });

  test('Basic render', async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: 'testtable',
          fields: mockFields,
          keyField: 'tlfId',
          viewData: mockData,
          totalRows: mockData.length,
          firstRow: 0,
          pageRows: 50,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <SimpleTableBody />
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText('keyField has not been found')).not.toBeInTheDocument();
  });
});
