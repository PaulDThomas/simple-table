import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SimpleTableContext } from "./SimpleTableContext";
import { SimpleTableHeaderContents } from "./SimpleTableHeaderContents";
import { ISimpleTableField, ISimpleTableRow, ISimpleTableSort } from "./interface";

const mockSort = jest.fn();

const mockFields: ISimpleTableField[] = [
  { name: "tlfId", hidden: true },
  {
    name: "displayName",
    hidden: false,
    label: "Name",
    sortFn: mockSort,
    width: "200px",
    canColumnFilter: true,
  },
  { name: "description", hidden: false, label: "Description" },
];

const mockData: ISimpleTableRow[] = [
  { TlfId: 1, displayName: "Lead", description: "Magic lead" },
  { TlfId: 2, displayName: "Tester", description: "A tester" },
  { TlfId: 3, displayName: "Other user", description: "Important VIP" },
];

const mockSortUp: ISimpleTableSort = { name: "displayName", asc: true };
const mockSortDown: ISimpleTableSort = { name: "displayName", asc: false };

const mockSorting = jest.fn();

describe("Simple table header contents renders", () => {
  test("Hidden field", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: "testtable",
          fields: mockFields,
          keyField: "userId",
          viewData: mockData,
          totalRows: mockData.length,
          firstRow: 0,
          pageRows: 50,
          sortBy: mockSortDown,
          columnWidths: [],
          currentColumnItems: [
            { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
          ],
          currentColumnFilter: null,
          currentColumnFilters: [
            { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
          ],
        }}
      >
        <SimpleTableHeaderContents
          field={mockFields[0]}
          columnNumber={0}
        />
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText("Id")).not.toBeInTheDocument();
  });

  test("Basic render", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: "testtable",
          fields: mockFields,
          keyField: "userId",
          viewData: mockData,
          totalRows: mockData.length,
          firstRow: 0,
          pageRows: 50,
          sortBy: mockSortUp,
          columnWidths: [],
          currentColumnItems: [
            { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
          ],
          currentColumnFilter: null,
          currentColumnFilters: [
            { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
          ],
        }}
      >
        <SimpleTableHeaderContents
          field={mockFields[1]}
          columnNumber={0}
        />
      </SimpleTableContext.Provider>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  test("Check sorting clicks", async () => {
    const user = userEvent.setup();
    await act(async () =>
      render(
        <SimpleTableContext.Provider
          value={{
            id: "testtable",
            fields: mockFields,
            keyField: "userId",
            viewData: mockData,
            totalRows: mockData.length,
            sortBy: mockSortDown,
            firstRow: 0,
            pageRows: 50,
            updateSortBy: mockSorting,
            columnWidths: [],
            currentColumnItems: [
              { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
            ],
            currentColumnFilter: null,
            currentColumnFilters: [
              { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
            ],
          }}
        >
          <SimpleTableHeaderContents
            field={mockFields[2]}
            columnNumber={0}
          />
        </SimpleTableContext.Provider>,
      ),
    );
    const desc = screen.queryByText("Description") as HTMLDivElement;
    expect(desc).toBeInTheDocument();
    await user.click(desc);
    expect(mockSorting).not.toHaveBeenCalledWith(mockFields[2]);
  });
});

describe("Filter on column values", () => {
  test("Display all filter", async () => {
    const user = userEvent.setup();
    const mockSet = jest.fn();
    const mockSetCurrentFilter = jest.fn();
    await act(async () => {
      render(
        <SimpleTableContext.Provider
          value={{
            id: "testtable",
            fields: mockFields,
            keyField: "userId",
            viewData: mockData,
            totalRows: mockData.length,
            sortBy: mockSortDown,
            firstRow: 0,
            pageRows: 50,
            updateSortBy: mockSorting,
            columnWidths: [],
            currentColumnItems: [
              { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
            ],
            currentColumnFilter: null,
            setCurrentColumnFilter: mockSetCurrentFilter,
            currentColumnFilters: [
              { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
            ],
            setCurrentColumnFilters: mockSet,
          }}
        >
          <div data-testid="container">
            <SimpleTableHeaderContents
              field={mockFields[1]}
              columnNumber={0}
            />
          </div>
        </SimpleTableContext.Provider>,
      );
    });
    const filter = screen.getByLabelText("Column filter");
    const selectTester = screen.getByLabelText("Tester");
    expect(filter).toBeInTheDocument();
    expect(selectTester).toBeInTheDocument();
    expect(selectTester).not.toBeVisible();
    await user.click(filter);
    expect(mockSetCurrentFilter).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentFilter).toHaveBeenCalledWith(0);
  });

  test("Display partial filter", async () => {
    const user = userEvent.setup();
    const mockSet = jest.fn();
    const mockSetCurrentFilter = jest.fn();
    await act(async () => {
      render(
        <SimpleTableContext.Provider
          value={{
            id: "testtable",
            fields: mockFields,
            keyField: "userId",
            viewData: mockData,
            totalRows: mockData.length,
            sortBy: mockSortUp,
            firstRow: 0,
            pageRows: 50,
            updateSortBy: mockSorting,
            columnWidths: [],
            currentColumnItems: [
              { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
            ],
            currentColumnFilter: 1,
            setCurrentColumnFilter: mockSetCurrentFilter,
            currentColumnFilters: [{ columnName: "displayName", values: ["Tester"] }],
            setCurrentColumnFilters: mockSet,
          }}
        >
          <div data-testid="container">
            <SimpleTableHeaderContents
              field={mockFields[1]}
              columnNumber={1}
            />
          </div>
        </SimpleTableContext.Provider>,
      );
    });
    const filter = screen.getByLabelText("Column filter (Active)");
    const selectTester = screen.getByLabelText("Tester");
    expect(filter).toBeInTheDocument();
    expect(selectTester).toBeInTheDocument();
    expect(selectTester).toBeVisible();
    await user.click(filter);
    expect(mockSetCurrentFilter).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentFilter).toHaveBeenCalledWith(null);
    expect(screen.queryByText("1 item selected")).toBeInTheDocument();
  });
});

describe("Custom render", () => {
  test("Custom render", async () => {
    const mockF = { ...mockFields[1], headerRenderFn: () => <>Woot!</> };
    await act(async () => {
      render(
        <SimpleTableContext.Provider
          value={{
            id: "testtable",
            fields: [mockF],
            keyField: "userId",
            viewData: mockData,
            totalRows: mockData.length,
            sortBy: mockSortUp,
            firstRow: 0,
            pageRows: 50,
            updateSortBy: mockSorting,
            columnWidths: [],
            currentColumnItems: [
              { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
            ],
            currentColumnFilter: null,
            currentColumnFilters: [
              { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
            ],
          }}
        >
          <SimpleTableHeaderContents
            field={mockF}
            columnNumber={0}
          />
        </SimpleTableContext.Provider>,
      );
    });
    expect(screen.queryByText("Woot!")).toBeInTheDocument();
  });
});
