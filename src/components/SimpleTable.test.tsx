import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ISimpleTableField, ISimpleTableRow } from "./interface";
import { SimpleTable } from "./SimpleTable";
import { act } from "react-dom/test-utils";

enum eAccessLevel {
  lead,
  editor,
  viewer,
  admin,
}

const mockFields: ISimpleTableField[] = [
  { name: "userid", label: "User ID", hidden: true },
  {
    name: "hierarchyLabel",
    label: "Hierarchy",
    searchFn: (rowData, searchText) =>
      (rowData.hierarchyLabel as string).toLowerCase().includes(searchText.toLowerCase().trim()),
    sortFn: (a, b) => (a.hierarchyLabel as string).localeCompare(b.hierarchyLabel as string),
  },
  {
    name: "displayName",
    label: "Display name",
    renderFn: ({ rowData }) => <span>{String(rowData.displayName)}</span>,
  },
  {
    name: "accessLevel",
    label: "Access level",
    filterOutFn: (rowData) => (rowData.accessLevel as eAccessLevel) === eAccessLevel.admin,
    canColumnFilter: true,
  },
];

const mockAccesses: ISimpleTableRow[] = [
  {
    userId: 2,
    hierarchyId: 4,
    displayName: "User-admin",
    prid: "Admin-prid",
    hierarchyLabel: "Some TA",
    accessLevel: eAccessLevel.admin,
  },
  {
    userId: 1,
    hierarchyId: 10,
    displayName: "User-lead",
    prid: "Lead-prid",
    hierarchyLabel: "SubHierarchy",
    accessLevel: eAccessLevel.lead,
  },
  {
    userId: 3,
    hierarchyId: 2,
    displayName: "User-view",
    prid: "View-prid",
    hierarchyLabel: "Corporate",
    accessLevel: eAccessLevel.viewer,
  },
];

describe("Simple table rendering", () => {
  test("Basic render", async () => {
    const { container } = render(
      <SimpleTable
        id="test-table"
        headerLabel="TEST TABLE"
        searchLabel="SEARCH HERE"
        filterLabel="FILTER HERE"
        showFilter={false}
        showSearch={false}
        fields={mockFields}
        keyField={"userId"}
        data={mockAccesses}
      />,
    );
    expect(screen.queryByText("TEST TABLE")).toBeInTheDocument();
    expect(screen.queryByText("SEARCH HERE")).not.toBeInTheDocument();
    expect(screen.queryByText("FILTER HERE")).not.toBeInTheDocument();
    expect(screen.queryByText("PRID")).not.toBeInTheDocument();
    expect(screen.queryByText("Hierarchy")).toBeInTheDocument();
    expect(screen.queryByText("Display name")).toBeInTheDocument();
    const cols = container.querySelectorAll("#test-table>thead>tr>th");
    expect(cols.length).toEqual(3);
    const rows = container.querySelectorAll("#test-table>tbody>tr");
    expect(rows.length).toEqual(3);
    const cells = container.querySelectorAll("#test-table>tbody>tr>td");
    expect(cells.length).toEqual(9);
  });

  test("No header", async () => {
    render(
      <SimpleTable
        id="test-table"
        headerLabel="TEST TABLE"
        searchLabel="SEARCH HERE"
        filterLabel="FILTER HERE"
        showHeader={false}
        showFilter={true}
        showSearch={false}
        fields={mockFields}
        keyField={"userId"}
        data={mockAccesses}
        selectable
      />,
    );
    expect(screen.queryByText("TEST TABLE")).not.toBeInTheDocument();
  });
});

describe("Interactive renders", () => {
  test("Search render", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SimpleTable
        id="test-table"
        headerLabel="TEST TABLE"
        searchLabel="SEARCH HERE"
        filterLabel="FILTER HERE"
        showFilter={false}
        showSearch={true}
        fields={mockFields}
        keyField={"userId"}
        data={mockAccesses}
      />,
    );
    expect(screen.queryByText("SEARCH HERE")).toBeInTheDocument();
    expect(screen.queryByText("FILTER HERE")).not.toBeInTheDocument();
    const searchBox = screen.getByRole("searchbox");
    await act(async () => await user.type(searchBox, "TA"));
    expect(searchBox).toHaveValue("TA");
    const cols = container.querySelectorAll("#test-table>thead>tr>th");
    expect(cols.length).toEqual(3);
    const rows = container.querySelectorAll("#test-table>tbody>tr");
    expect(rows.length).toEqual(1);
    const cells = container.querySelectorAll("#test-table>tbody>tr>td");
    expect(cells.length).toEqual(3);
    expect(screen.queryByText("User-admin")).toBeInTheDocument();
    expect(screen.queryByText("User-lead")).not.toBeInTheDocument();
    expect(screen.queryByText("User-view")).not.toBeInTheDocument();
  });

  test("Filter render", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SimpleTable
        id="test-table"
        headerLabel="TEST TABLE"
        searchLabel="SEARCH HERE"
        filterLabel="FILTER HERE"
        showFilter={true}
        showSearch={false}
        fields={mockFields}
        keyField={"userId"}
        data={mockAccesses}
      />,
    );
    expect(screen.queryByText("SEARCH HERE")).not.toBeInTheDocument();
    expect(screen.queryByText("FILTER HERE")).toBeInTheDocument();
    const filter = screen.getByRole("checkbox");
    await act(async () => await user.click(filter));
    const cols = container.querySelectorAll("#test-table>thead>tr>th");
    expect(cols.length).toEqual(3);
    const rows = container.querySelectorAll("#test-table>tbody>tr");
    expect(rows.length).toEqual(2);
    const cells = container.querySelectorAll("#test-table>tbody>tr>td");
    expect(cells.length).toEqual(6);
    expect(screen.queryByText("User-admin")).not.toBeInTheDocument();
    expect(screen.queryByText("User-lead")).toBeInTheDocument();
    expect(screen.queryByText("User-view")).toBeInTheDocument();
  });

  test("Sort render", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SimpleTable
        id="test-table"
        headerLabel="TEST TABLE"
        searchLabel="SEARCH HERE"
        filterLabel="FILTER HERE"
        showFilter={true}
        showSearch={false}
        fields={mockFields}
        keyField={"userId"}
        data={mockAccesses}
      />,
    );
    expect(screen.queryByText("SEARCH HERE")).not.toBeInTheDocument();
    expect(screen.queryByText("FILTER HERE")).toBeInTheDocument();
    const hierarchyLabel = screen.getByText("Hierarchy");
    await act(async () => await user.click(hierarchyLabel));
    const cols = container.querySelectorAll("#test-table>thead>tr>th");
    expect(cols.length).toEqual(3);
    const rows = container.querySelectorAll("#test-table>tbody>tr");
    expect(rows.length).toEqual(3);
    const cells = container.querySelectorAll("#test-table>tbody>tr>td");
    expect(cells.length).toEqual(9);
    expect(screen.queryByText("User-admin")).toBeInTheDocument();
    expect(screen.queryByText("User-lead")).toBeInTheDocument();
    expect(screen.queryByText("User-view")).toBeInTheDocument();
    expect(rows[0].children[0].textContent).toEqual("Corporate");
    expect(rows[1].children[0].textContent).toEqual("Some TA");
    expect(rows[2].children[0].textContent).toEqual("SubHierarchy");
    await act(async () => await user.click(hierarchyLabel));
    expect(rows[2].children[0].textContent).toEqual("SubHierarchy");
    expect(rows[1].children[0].textContent).toEqual("Some TA");
    expect(rows[0].children[0].textContent).toEqual("Corporate");
    await act(async () => await user.click(hierarchyLabel));
    expect(rows[1].children[0].textContent).toEqual("Some TA");
    expect(rows[2].children[0].textContent).toEqual("SubHierarchy");
    expect(rows[0].children[0].textContent).toEqual("Corporate");
  });
});

const mockSetSelection = jest.fn();
describe("Toggle rows", () => {
  test("Check untoggled", async () => {
    const { container } = render(
      <SimpleTable
        id="test-table"
        headerLabel="TEST TABLE"
        searchLabel="SEARCH HERE"
        filterLabel="FILTER HERE"
        showFilter={true}
        showSearch={false}
        fields={mockFields}
        keyField={"userId"}
        data={mockAccesses}
        selectable
      />,
    );
    const checkAll = container.querySelector("#test-table-check-all") as HTMLInputElement;
    const rowCheck1 = container.querySelector("#test-table-check-row-1") as HTMLInputElement;
    const rowCheck2 = container.querySelector("#test-table-check-row-2") as HTMLInputElement;
    const rowCheck3 = container.querySelector("#test-table-check-row-3") as HTMLInputElement;
    expect(checkAll).not.toBeChecked();
    expect(rowCheck1).not.toBeChecked();
    expect(rowCheck2).not.toBeChecked();
    expect(rowCheck3).not.toBeChecked();
  });

  test("No header", async () => {
    render(
      <SimpleTable
        id="test-table"
        headerLabel="TEST TABLE"
        searchLabel="SEARCH HERE"
        filterLabel="FILTER HERE"
        showHeader={false}
        showFilter={true}
        showSearch={false}
        fields={mockFields}
        keyField={"userId"}
        data={mockAccesses}
        selectable
      />,
    );
    expect(screen.queryByText("TEST TABLE")).not.toBeInTheDocument();
  });

  test("Toggle all", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SimpleTable
        id="test-table"
        headerLabel="TEST TABLE"
        searchLabel="SEARCH HERE"
        filterLabel="FILTER HERE"
        showFilter={true}
        showSearch={false}
        fields={mockFields}
        keyField={"userId"}
        data={mockAccesses}
        selectable
        currentSelection={[]}
        setCurrentSelection={mockSetSelection}
      />,
    );
    const checkAll = container.querySelector("#test-table-check-all") as HTMLInputElement;
    expect(checkAll).not.toBeChecked();
    await user.click(checkAll);
    expect(checkAll).toBeChecked();
    expect(mockSetSelection).toHaveBeenCalledWith([2, 1, 3]);
  });

  test("Toggle off", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SimpleTable
        id="test-table"
        headerLabel="TEST TABLE"
        searchLabel="SEARCH HERE"
        filterLabel="FILTER HERE"
        fields={mockFields}
        keyField={"userId"}
        data={mockAccesses}
        selectable
        currentSelection={[1, 2, 3]}
        setCurrentSelection={mockSetSelection}
      />,
    );
    const checkAll = container.querySelector("#test-table-check-all") as HTMLInputElement;
    expect(checkAll).toBeChecked();
    await user.click(checkAll);
    expect(checkAll).not.toBeChecked();
    expect(mockSetSelection).toHaveBeenCalledWith([]);
  });

  test("Search toggle off", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SimpleTable
        id="test-table"
        headerLabel="TEST TABLE"
        searchLabel="SEARCH HERE"
        filterLabel="FILTER HERE"
        showFilter={true}
        showSearch={true}
        fields={mockFields}
        keyField={"userId"}
        data={mockAccesses}
        selectable
        currentSelection={[1, 2, 3]}
        setCurrentSelection={mockSetSelection}
      />,
    );
    const checkAll = container.querySelector("#test-table-check-all") as HTMLInputElement;
    expect(checkAll).toBeChecked();
    const searchBox = screen.getByRole("searchbox");
    await act(async () => await user.type(searchBox, "TA"));
    expect(searchBox).toHaveValue("TA");
    await user.click(checkAll);
    expect(mockSetSelection).toHaveBeenCalledWith([1, 3]);
  });

  test("Search toggle on", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SimpleTable
        id="test-table"
        headerLabel="TEST TABLE"
        searchLabel="SEARCH HERE"
        filterLabel="FILTER HERE"
        showFilter={true}
        showSearch={true}
        fields={mockFields}
        keyField={"userId"}
        data={mockAccesses}
        selectable
        setCurrentSelection={mockSetSelection}
      />,
    );
    const checkAll = container.querySelector("#test-table-check-all") as HTMLInputElement;
    expect(checkAll).not.toBeChecked();
    const searchBox = screen.getByRole("searchbox");
    await act(async () => await user.type(searchBox, "TA"));
    expect(searchBox).toHaveValue("TA");
    await user.click(checkAll);
    expect(mockSetSelection).toHaveBeenCalledWith([2]);
  });

  test("Single toggle on", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SimpleTable
        id="test-table"
        headerLabel="TEST TABLE"
        searchLabel="SEARCH HERE"
        filterLabel="FILTER HERE"
        showFilter={true}
        showSearch={true}
        fields={mockFields}
        keyField={"userId"}
        data={mockAccesses}
        selectable
        currentSelection={[1, 2]}
        setCurrentSelection={mockSetSelection}
      />,
    );
    const checkAll = container.querySelector("#test-table-check-all") as HTMLInputElement;
    const rowCheck1 = container.querySelector("#test-table-check-row-1") as HTMLInputElement;
    const rowCheck3 = container.querySelector("#test-table-check-row-3") as HTMLInputElement;
    expect(checkAll).not.toBeChecked();
    expect(checkAll.indeterminate).toEqual(true);
    await user.click(rowCheck1);
    expect(mockSetSelection).toHaveBeenCalledWith([2]);
    await user.click(rowCheck3);
    expect(mockSetSelection).toHaveBeenCalledWith([1, 2, 3]);
  });
});

describe("Local settings", () => {
  test("Load settings", async () => {
    await act(async () => {
      render(
        <SimpleTable
          id="test-table"
          headerLabel="TEST TABLE"
          searchLabel="SEARCH HERE"
          filterLabel="FILTER HERE"
          showFilter={true}
          showSearch={true}
          fields={mockFields}
          keyField={"userId"}
          data={mockAccesses}
          selectable
          currentSelection={[1, 2]}
          setCurrentSelection={mockSetSelection}
        />,
      );
    });

    expect(screen.queryByText("TEST TABLE")).toBeInTheDocument();
  });
});

describe("Test callbacks", () => {
  test("onPagerChange callback number of rows", async () => {
    const user = userEvent.setup();
    const mockOnPagerChange = jest.fn();
    await act(async () =>
      render(
        <SimpleTable
          id="test-table"
          headerLabel="TEST TABLE"
          searchLabel="SEARCH HERE"
          filterLabel="FILTER HERE"
          showFilter={true}
          showSearch={true}
          fields={mockFields}
          keyField={"userId"}
          data={Array(200)
            .fill(mockAccesses)
            .map((_, i) => ({ ..._, userId: i }))
            .flat()}
          onPagerChange={mockOnPagerChange}
        />,
      ),
    );
    const rows = screen.getByLabelText("Visible rows");
    await act(async () => await user.selectOptions(rows, "100"));
    expect(mockOnPagerChange).toHaveBeenCalledWith({ firstRow: 0, pageRows: 100 });
    const next = screen.getByLabelText("Go to next page");
    await act(async () => await user.click(next));
    expect(mockOnPagerChange).toHaveBeenCalledWith({ firstRow: 100, pageRows: 100 });
  });

  test("onWidthChange callback", async () => {
    const mockOnWidthChange = jest.fn();
    await act(async () =>
      render(
        <SimpleTable
          id="test-table"
          headerLabel="TEST TABLE"
          searchLabel="SEARCH HERE"
          filterLabel="FILTER HERE"
          showFilter={true}
          showSearch={true}
          fields={mockFields}
          keyField={"userId"}
          data={mockAccesses}
          onWidthChange={mockOnWidthChange}
        />,
      ),
    );
    const handles = screen.getAllByRole("separator");
    const firstHandle = handles[0];
    fireEvent.mouseDown(firstHandle);
    fireEvent.mouseMove(firstHandle, { clientX: 200 });
    fireEvent.mouseUp(firstHandle);
    expect(mockOnWidthChange).toHaveBeenCalledWith(["200px", undefined, undefined, undefined]);
  });

  test("All rows shown when no pager", async () => {
    await act(async () =>
      render(
        <div data-testid="container">
          <SimpleTable
            id="test-table"
            headerLabel="TEST TABLE"
            searchLabel="SEARCH HERE"
            filterLabel="FILTER HERE"
            showFilter={true}
            showSearch={true}
            fields={mockFields}
            keyField={"userId"}
            data={Array(500)
              .fill(mockAccesses)
              .flat()
              .map((_, i) => ({ ..._, userId: i }))}
            showPager={false}
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
    expect(container.querySelectorAll("tr.simpletable-bodyrow").length).toEqual(
      mockAccesses.length * 500,
    );
  });

  test("Bad sort function handled", async () => {
    const mockFieldsBad: ISimpleTableField[] = [
      { name: "userid", label: "User ID", hidden: true },
      {
        name: "hierarchyLabel",
        label: "Hierarchy",
        sortFn: () => {
          throw new Error("Bad sort function");
        },
      },
    ];
    await act(async () =>
      render(
        <SimpleTable
          id="test-table"
          headerLabel="TEST TABLE"
          searchLabel="SEARCH HERE"
          filterLabel="FILTER HERE"
          showFilter={true}
          showSearch={true}
          fields={mockFieldsBad}
          keyField={"userId"}
          data={mockAccesses}
        />,
      ),
    );
    const hierarchyLabel = screen.getByText("Hierarchy");
    expect(hierarchyLabel).toBeInTheDocument();
    await userEvent.click(hierarchyLabel);
  });

  test("Ensure scroll resets on filter change", async () => {
    const user = userEvent.setup();
    await act(async () =>
      render(
        <div data-testid="container">
          <SimpleTable
            data-testid="test-table"
            id="test-table"
            headerLabel="TEST TABLE"
            searchLabel="SEARCH HERE"
            filterLabel="FILTER HERE"
            showFilter={true}
            showSearch={true}
            fields={[{ name: "userId", label: "User ID", hidden: false }, ...mockFields.slice(1)]}
            keyField={"userId"}
            data={Array(100)
              .fill(mockAccesses)
              .flat()
              .map((_, i) => ({ ..._, userId: i }))}
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
    const last = screen.queryByLabelText("Go to last page") as Element;
    await user.click(last);
    // Expect last cell to be shown
    expect(
      container.querySelector(".simpletable-bodyrow:last-child > td:first-child")?.textContent,
    ).toEqual("299");
    // Apply filter
    await user.click(screen.getByLabelText("FILTER HERE"));
    expect(
      container.querySelectorAll("tr.simpletable-bodyrow:first-child > td:first-child").length,
    ).toEqual(1);
  });
});
