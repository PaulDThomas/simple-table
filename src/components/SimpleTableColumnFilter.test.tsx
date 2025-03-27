import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { SimpleTableColumnFilter } from "./SimpleTableColumnFilter";
import { ISimpleTableColumnFilter, SimpleTableContext } from "./SimpleTableContext";
import { ISimpleTableField, ISimpleTableRow } from "./interface";

const mockFields: ISimpleTableField[] = [
  { name: "userId", hidden: true, label: "UserId" },
  { name: "displayName", label: "Display name" },
];

const mockData: ISimpleTableRow[] = [
  { userId: 1, displayName: "User 1" },
  { userId: 2, displayName: "User 2" },
  { userId: 3, displayName: "User 3" },
  { userId: "four", displayName: "Another user" },
];

describe("Simple table column filter rendering", () => {
  test("Basic render", async () => {
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
            firstRow: 0,
            pageRows: 50,
            selectable: true,
            columnWidths: [],
            currentColumnItems: [
              { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
            ],
            currentColumnFilter: 0,
            setCurrentColumnFilter: mockSetCurrentFilter,
            currentColumnFilters: [
              { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
            ],
            setCurrentColumnFilters: mockSet,
          }}
        >
          <SimpleTableColumnFilter columnName={"displayName"} />
        </SimpleTableContext.Provider>,
      );
    });
    expect(screen.queryByText("3 items selected")).toBeInTheDocument();
    expect(screen.queryByLabelText("Column filter search")).toBeInTheDocument();
    expect(screen.queryByLabelText("Column filter toggle")).toBeInTheDocument();
    expect(screen.queryByLabelText("Tester")).toBeInTheDocument();
    await user.click(screen.queryByLabelText("Column filter toggle") as HTMLInputElement);
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith([{ columnName: "displayName", values: [] }]);
    await user.click(screen.queryByLabelText("Close filter") as Element);
    expect(mockSetCurrentFilter).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentFilter).toHaveBeenCalledWith(null);
  });

  test("Add to filter", async () => {
    const user = userEvent.setup();
    await act(async () => {
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
            selectable: true,
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
          <SimpleTableColumnFilter columnName={"displayName"} />
        </SimpleTableContext.Provider>,
      );
    });
    const search = screen.queryByLabelText("Column filter search") as HTMLInputElement;
    expect(screen.queryByLabelText("Lead")).toBeInTheDocument();
    await act(async () => await user.type(search, "Te"));
    expect(screen.queryByLabelText("Lead")).not.toBeInTheDocument();
  });
});

describe("Update filter", () => {
  test("Uncheck boxes", async () => {
    const user = userEvent.setup();
    let cf = [{ columnName: "displayName", values: ["Lead"] }];
    const mockSet = jest.fn((newCf) => {
      cf = newCf;
    });
    await act(async () => {
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
            selectable: true,
            columnWidths: [],
            currentColumnItems: [
              { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
            ],
            currentColumnFilter: null,
            currentColumnFilters: cf,
            setCurrentColumnFilters: mockSet,
          }}
        >
          <SimpleTableColumnFilter columnName={"displayName"} />
        </SimpleTableContext.Provider>,
      );
    });
    const lead = screen.getByLabelText("Lead");
    const tester = screen.getByLabelText("Tester");
    await user.click(lead);
    expect(mockSet).toHaveBeenLastCalledWith([{ columnName: "displayName", values: [] }]);
    await user.click(tester);
    expect(mockSet).toHaveBeenLastCalledWith([
      { columnName: "displayName", values: ["Lead", "Tester"] },
    ]);
  });
});

describe("Update toggle", () => {
  test("Check all", async () => {
    const user = userEvent.setup();
    const mockSet = jest.fn();
    await act(async () => {
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
            selectable: true,
            columnWidths: [],
            currentColumnItems: [
              { columnName: "displayName", values: ["Lead", "Tester", "Other user"] },
            ],
            currentColumnFilter: null,
            currentColumnFilters: [],
            setCurrentColumnFilters: mockSet,
          }}
        >
          <SimpleTableColumnFilter columnName={"displayName"} />
        </SimpleTableContext.Provider>,
      );
    });
    const all = screen.getByLabelText("Column filter toggle");
    await user.click(all);
    expect(mockSet).toHaveBeenLastCalledWith([
      { columnName: "displayName", values: ["Lead", "Other user", "Tester"] },
    ]);
  });
});

describe("Update search toggle", () => {
  const user = userEvent.setup();
  const MockComponent = ({
    currentColumnFilters,
    setCurrentColumnFilters,
  }: {
    currentColumnFilters: ISimpleTableColumnFilter[];
    setCurrentColumnFilters: (ret: ISimpleTableColumnFilter[]) => void;
  }) => (
    <SimpleTableContext.Provider
      value={{
        id: "testtable",
        fields: mockFields,
        keyField: "userId",
        viewData: mockData,
        totalRows: mockData.length,
        firstRow: 0,
        pageRows: 50,
        selectable: true,
        columnWidths: [],
        currentColumnItems: [
          {
            columnName: "displayName",
            values: ["Lead", "Tester 1", "Tester 2", "Tester 3", "Tester 4", "Other user"],
          },
        ],
        currentColumnFilter: null,
        currentColumnFilters,
        setCurrentColumnFilters,
      }}
    >
      <SimpleTableColumnFilter columnName={"displayName"} />
    </SimpleTableContext.Provider>
  );
  test("Search and toggle", async () => {
    const mockSet = jest.fn();
    await act(async () =>
      render(
        <MockComponent
          currentColumnFilters={[]}
          setCurrentColumnFilters={mockSet}
        />,
      ),
    );

    const search = screen.queryByLabelText("Column filter search") as HTMLInputElement;
    expect(screen.queryByLabelText("Column search filter toggle")).not.toBeInTheDocument();
    await user.type(search, "te");
    const searchToggle = screen.queryByLabelText("Column search filter toggle") as HTMLInputElement;
    expect(searchToggle).toBeInTheDocument();
    // No items selected initially
    const all = screen.queryByLabelText("Column filter toggle") as HTMLInputElement;
    expect(all).toBeInTheDocument();
    expect(all).not.toBeChecked();
    // This should add all testers
    await user.click(searchToggle);
    expect(mockSet).toHaveBeenLastCalledWith([
      { columnName: "displayName", values: ["Tester 1", "Tester 2", "Tester 3", "Tester 4"] },
    ]);
  });

  test("Uncheck all", async () => {
    const mockSet = jest.fn();
    await act(async () =>
      render(
        <MockComponent
          currentColumnFilters={[{ columnName: "displayName", values: ["Tester 1", "Tester 2"] }]}
          setCurrentColumnFilters={mockSet}
        />,
      ),
    );

    const search = screen.queryByLabelText("Column filter search") as HTMLInputElement;
    expect(screen.queryByLabelText("Column search filter toggle")).not.toBeInTheDocument();
    await user.type(search, "te");
    const searchToggle = screen.queryByLabelText("Column search filter toggle") as HTMLInputElement;
    expect(searchToggle).toBeInTheDocument();

    expect(searchToggle.indeterminate).toBe(true);
    await user.click(searchToggle);
    expect(mockSet).toHaveBeenLastCalledWith([
      {
        columnName: "displayName",
        values: [],
      },
    ]);
  });
});
