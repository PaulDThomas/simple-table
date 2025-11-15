import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { defaultContext, SimpleTableContext } from "./SimpleTableContext";
import { SimpleTableHeader } from "./SimpleTableHeader";
import { ISimpleTableField, ISimpleTableRow, ISimpleTableSort } from "./interface";

jest.mock("./SimpleTableHeaderContents");

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
const mockSortDown: ISimpleTableSort = { name: "description", asc: false };

const mockSorting = jest.fn();

describe("Simple table header renders", () => {
  test("No context render", async () => {
    render(
      <table>
        <thead>
          <tr>
            <SimpleTableHeader />
          </tr>
        </thead>
      </table>,
    );
    expect(screen.queryByText("Name")).not.toBeInTheDocument();
    expect(screen.queryByText("Description")).not.toBeInTheDocument();
  });

  test("Basic render", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          ...defaultContext,
          id: "testtable",
          fields: mockFields,
          keyField: "userId",
          viewData: mockData,
          totalRows: mockData.length,
          sortBy: mockSortDown,
          currentColumnItems: [
            { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
          ],
          currentColumnFilters: [
            { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
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
    expect(screen.getByText("0:displayName")).toBeInTheDocument();
    expect(screen.getByText("1:description")).toBeInTheDocument();
  });
});

describe("Resize table cell", () => {
  test("Resize", async () => {
    await act(async () => {
      render(
        <SimpleTableContext.Provider
          value={{
            ...defaultContext,
            id: "testtable",
            fields: mockFields,
            keyField: "userId",
            viewData: mockData,
            totalRows: mockData.length,
            sortBy: mockSortUp,
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
          <div data-testid="container">
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
    const container = await screen.findByTestId("container");
    const cells = container.querySelectorAll("th");
    const rhs = container.querySelectorAll("th div.resizeHandle");
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
