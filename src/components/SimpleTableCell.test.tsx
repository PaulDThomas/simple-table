import { render, screen } from "@testing-library/react";
import { ISimpleTableField, ISimpleTableRow } from "./interface";
import { SimpleTableCell } from "./SimpleTableCell";
import { SimpleTableContext } from "./SimpleTableContext";

const mockFields: ISimpleTableField[] = [
  { name: "userId", label: "User ID" },
  { name: "hierarchyId", label: "Hierarchy ID" },
  { name: "displayName", label: "Name" },
  {
    name: "customField",
    label: "Name",
    renderFn: ({ cellField }) => <span>Hello! {cellField}</span>,
  },
  { name: "allowed" },
  { name: "accessLevel" },
];

enum mockEnum {
  one = "ONE",
  two = "TWO",
  three = "THREE",
}

const mockAccesses: ISimpleTableRow[] = [
  {
    userId: 1,
    hierarchyId: 10,
    displayName: "User-lead",
    prid: "Lead-prid",
    hierarchyLabel: "SubHierarchy",
    accessLevel: true,
    allowed: mockEnum.one,
  },
  {
    userId: 2,
    hierarchyId: 4,
    displayName: "User-admin",
    prid: "Admin-prid",
    hierarchyLabel: "Some TA",
    accessLevel: false,
    allowed: mockEnum.two,
  },
  {
    userId: 3,
    hierarchyId: 2,
    displayName: "User-view",
    prid: "View-prid",
    hierarchyLabel: "Corporate",
    allowed: mockEnum.three,
  },
];

describe("Bad cell rendering", () => {
  test("Data & field not found", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: "test-table",
          fields: mockFields,
          keyField: "userId",
          viewData: mockAccesses,
          totalRows: mockAccesses.length,
          firstRow: 0,
          pageRows: 50,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <tbody>
            <tr>
              <SimpleTableCell
                rowId={"abc"}
                cellField='col1'
                columnNumber={1}
                rowNumber={0}
              />
            </tr>
          </tbody>
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText("Row data, Field not found")).toBeInTheDocument();
  });

  test("Data not found", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: "test-table",
          fields: mockFields,
          keyField: "userId",
          viewData: mockAccesses,
          totalRows: mockAccesses.length,
          firstRow: 0,
          pageRows: 50,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <tbody>
            <tr>
              <SimpleTableCell
                rowNumber={0}
                rowId={"abc"}
                cellField='hierarchyId'
                columnNumber={1}
              />
            </tr>
          </tbody>
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText("Row data not found")).toBeInTheDocument();
  });

  test("Field not found", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: "test-table",
          fields: mockFields,
          keyField: "userId",
          viewData: mockAccesses,
          totalRows: mockAccesses.length,
          firstRow: 0,
          pageRows: 50,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <tbody>
            <tr>
              <SimpleTableCell
                rowId={1}
                cellField='hierarchyLabel'
                columnNumber={1}
                rowNumber={0}
              />
            </tr>
          </tbody>
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText("Field not found")).toBeInTheDocument();
  });
});

describe("Cell render, show things", () => {
  test("Basic render, string", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: "test-table",
          fields: mockFields,
          keyField: "userId",
          viewData: mockAccesses,
          totalRows: mockAccesses.length,
          firstRow: 0,
          pageRows: 50,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <tbody>
            <tr>
              <SimpleTableCell
                rowId={2}
                cellField='displayName'
                columnNumber={0}
                rowNumber={0}
              />
            </tr>
          </tbody>
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText("User-admin")).toBeInTheDocument();
  });

  test("Basic render, number", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: "test-table",
          fields: mockFields,
          keyField: "userId",
          viewData: mockAccesses,
          totalRows: mockAccesses.length,
          firstRow: 0,
          pageRows: 50,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <tbody>
            <tr>
              <SimpleTableCell
                rowId={2}
                cellField='userId'
                columnNumber={0}
                rowNumber={0}
              />
            </tr>
          </tbody>
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText("2")).toBeInTheDocument();
  });

  test("Basic render, enum", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: "test-table",
          fields: mockFields,
          keyField: "userId",
          viewData: mockAccesses,
          totalRows: mockAccesses.length,
          firstRow: 0,
          pageRows: 50,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <tbody>
            <tr>
              <SimpleTableCell
                rowId={2}
                cellField='allowed'
                columnNumber={0}
                rowNumber={0}
              />
            </tr>
          </tbody>
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText("TWO")).toBeInTheDocument();
  });

  test("Basic render, boolean", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: "test-table",
          fields: mockFields,
          keyField: "userId",
          viewData: mockAccesses,
          totalRows: mockAccesses.length,
          firstRow: 0,
          pageRows: 50,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <tbody>
            <tr>
              <SimpleTableCell
                rowId={2}
                cellField='accessLevel'
                columnNumber={0}
                rowNumber={0}
              />
            </tr>
          </tbody>
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText("false")).toBeInTheDocument();
  });

  test("Basic render, boolean", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: "test-table",
          fields: mockFields,
          keyField: "userId",
          viewData: mockAccesses,
          totalRows: mockAccesses.length,
          firstRow: 0,
          pageRows: 50,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <table>
          <tbody>
            <tr>
              <SimpleTableCell
                rowId={2}
                cellField='customField'
                columnNumber={0}
                rowNumber={2}
              />
            </tr>
          </tbody>
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText("Hello! customField")).toBeInTheDocument();
  });
});
