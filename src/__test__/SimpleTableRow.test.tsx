import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { iSimpleTableField, iSimpleTableRow } from '../components/interface';
import { SimpleTableContext } from '../components/SimpleTableContext';
import { SimpleTableRow } from '../components/SimpleTableRow';

const mockFields: iSimpleTableField[] = [
  { name: 'userId', hidden: true, label: 'UserId' },
  { name: 'displayName', label: 'Display name' },
];

const mockData: iSimpleTableRow = {
  userId: 3,
  displayName: 'Some user',
};

const mockToggle = jest.fn();
describe('Access rights row rendering', () => {
  test('Basic render', async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: 'testtable',
          fields: mockFields,
          keyField: 'userId',
          viewData: [mockData],
          tableData: [mockData],
          selectable: true,
        }}
      >
        <table>
          <tbody>
            <SimpleTableRow rowId={3} />
          </tbody>
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText('3')).not.toBeInTheDocument();
    expect(screen.queryByText('Some user')).toBeInTheDocument();
  });
  test('Render and click', async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: 'testtable',
          fields: mockFields,
          keyField: 'userId',
          viewData: [mockData],
          tableData: [mockData],
          selectable: true,
          currentSelection: [3],
          toggleSelection: mockToggle,
        }}
      >
        <table>
          <tbody>
            <SimpleTableRow rowId={3} />
          </tbody>
        </table>
      </SimpleTableContext.Provider>,
    );
    const check = screen.getByRole('checkbox');
    expect(check).toBeInTheDocument();
    act(() => {
      fireEvent.click(check);
    });
    expect(mockToggle).toHaveBeenCalledWith(3);
  });
});
