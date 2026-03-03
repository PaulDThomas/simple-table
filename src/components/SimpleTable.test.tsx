import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act, useState } from "react";
import { localStorageMock } from "../../__dummy__/localStorageMock";
import { ISimpleTableField, ISimpleTableRow } from "./interface";
import { SimpleTable } from "./SimpleTable";

jest.mock("./SimpleTablePopover");

enum eAccessLevel {
  lead,
  editor,
  viewer,
  admin,
}

const mockFields: ISimpleTableField[] = [
  { name: "userId", label: "User ID", hidden: true },
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
    await act(async () =>
      render(
        <div data-testid="container">
          <SimpleTable
            id="test-table"
            headerLabel="TEST TABLE"
            searchLabel="SEARCH HERE"
            filterLabel="FILTER HERE"
            showHeader={false}
            showFilter={false}
            showSearch={false}
            fields={mockFields}
            keyField={"userId"}
            data={mockAccesses}
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
    expect(screen.queryByText("TEST TABLE")).not.toBeInTheDocument();
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
    await act(async () =>
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
      ),
    );
    expect(screen.queryByText("TEST TABLE")).not.toBeInTheDocument();
  });
});

describe("Interactive renders", () => {
  test("Search render", async () => {
    const user = userEvent.setup();
    await act(async () =>
      render(
        <div data-testid="container">
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
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
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
    await act(async () =>
      render(
        <div data-testid="container">
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
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
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
    await act(async () =>
      render(
        <div data-testid="container">
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
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
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
    await act(async () =>
      render(
        <div data-testid="container">
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
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
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
    await act(async () =>
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
      ),
    );
    expect(screen.queryByText("TEST TABLE")).not.toBeInTheDocument();
  });

  test("Toggle all", async () => {
    const user = userEvent.setup();
    await act(async () =>
      render(
        <div data-testid="container">
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
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
    const checkAll = container.querySelector("#test-table-check-all") as HTMLInputElement;
    expect(checkAll).not.toBeChecked();
    await user.click(checkAll);
    expect(checkAll).toBeChecked();
    expect(mockSetSelection).toHaveBeenCalledWith([2, 1, 3]);
  });

  test("Toggle off", async () => {
    const user = userEvent.setup();
    await act(async () =>
      render(
        <div data-testid="container">
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
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
    const checkAll = container.querySelector("#test-table-check-all") as HTMLInputElement;
    expect(checkAll).toBeChecked();
    await user.click(checkAll);
    expect(checkAll).not.toBeChecked();
    expect(mockSetSelection).toHaveBeenCalledWith([]);
  });

  test("Search toggle off", async () => {
    const user = userEvent.setup();
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
            data={mockAccesses}
            selectable
            currentSelection={[1, 2, 3]}
            setCurrentSelection={mockSetSelection}
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
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
            data={mockAccesses}
            selectable
            setCurrentSelection={mockSetSelection}
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
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
            data={mockAccesses}
            selectable
            currentSelection={[1, 2]}
            setCurrentSelection={mockSetSelection}
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
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
  beforeAll(() => {
    // Mock localStorage
    Object.defineProperty(window, "localStorage", { value: new localStorageMock() });
  });

  test("Load settings, all page rows", async () => {
    // Add local setting for asup.simple-table.test-table.settings
    window.localStorage.setItem(
      "asup.simple-table.test-table.settings",
      JSON.stringify({
        headerWidths: [
          { name: "hierarchyLabel", width: "200px" },
          { name: "displayName", width: "300px" },
        ],
        pageRows: "Infinity",
      }),
    );

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
    const pagerSelect = screen.getByLabelText("Visible rows");
    expect(pagerSelect).toBeInTheDocument();
    expect(pagerSelect).toHaveValue("All");

    // Check width settings
    const header1 = screen.getByText("Hierarchy").closest("th") as HTMLElement;
    expect(header1).toHaveStyle("width: 200px");
    const header2 = screen.getByText("Display name").closest("th") as HTMLElement;
    expect(header2).toHaveStyle("width: 300px");

    // Clean up
    window.localStorage.removeItem("asup.simple-table.test-table.settings");
  });

  test("Loads column widths from column settings", async () => {
    const updatedMockFields = mockFields.map((field) => {
      if (field.name === "hierarchyLabel") {
        return { ...field, width: "150px" };
      }
      return field;
    });
    await act(async () => {
      render(
        <SimpleTable
          id="test-table"
          headerLabel="TEST TABLE"
          searchLabel="SEARCH HERE"
          filterLabel="FILTER HERE"
          showFilter={true}
          showSearch={true}
          fields={updatedMockFields}
          keyField={"userId"}
          data={mockAccesses}
          selectable
          currentSelection={[1, 2]}
          setCurrentSelection={mockSetSelection}
        />,
      );
    });

    // Check width setting
    const header = screen.getByText("Hierarchy").closest("th") as HTMLElement;
    expect(header).toHaveStyle("width: 150px");
  });

  test("Load settings with numeric pageRows", async () => {
    // Test with numeric pageRows (not a string)
    const mockSetSelection = jest.fn();
    window.localStorage.setItem(
      "asup.simple-table.test-table.settings",
      JSON.stringify({
        pageRows: 50,
      }),
    );

    await act(async () => {
      render(
        <SimpleTable
          id="test-table"
          headerLabel="TEST TABLE"
          fields={mockFields}
          keyField={"userId"}
          data={mockAccesses}
          selectable
          currentSelection={[1, 2]}
          setCurrentSelection={mockSetSelection}
        />,
      );
    });

    const pagerSelect = screen.getByLabelText("Visible rows");
    expect(pagerSelect).toHaveValue("50");

    window.localStorage.removeItem("asup.simple-table.test-table.settings");
  });

  test("Ignores invalid local settings - non-object", async () => {
    window.localStorage.setItem("asup.simple-table.test-table.settings", JSON.stringify("invalid"));

    await act(async () => {
      render(
        <SimpleTable
          id="test-table"
          headerLabel="TEST TABLE"
          fields={mockFields}
          keyField={"userId"}
          data={mockAccesses}
        />,
      );
    });

    expect(screen.queryByText("TEST TABLE")).toBeInTheDocument();
    window.localStorage.removeItem("asup.simple-table.test-table.settings");
  });

  test("Ignores invalid local settings - invalid pageRows type", async () => {
    window.localStorage.setItem(
      "asup.simple-table.test-table.settings",
      JSON.stringify({ pageRows: { invalid: true } }),
    );

    await act(async () => {
      render(
        <SimpleTable
          id="test-table"
          headerLabel="TEST TABLE"
          fields={mockFields}
          keyField={"userId"}
          data={mockAccesses}
        />,
      );
    });

    expect(screen.queryByText("TEST TABLE")).toBeInTheDocument();
    window.localStorage.removeItem("asup.simple-table.test-table.settings");
  });

  test("Ignores invalid local settings - invalid headerWidths type", async () => {
    window.localStorage.setItem(
      "asup.simple-table.test-table.settings",
      JSON.stringify({ headerWidths: "invalid" }),
    );

    await act(async () => {
      render(
        <SimpleTable
          id="test-table"
          headerLabel="TEST TABLE"
          fields={mockFields}
          keyField={"userId"}
          data={mockAccesses}
        />,
      );
    });

    expect(screen.queryByText("TEST TABLE")).toBeInTheDocument();
    window.localStorage.removeItem("asup.simple-table.test-table.settings");
  });

  test("Load settings, some page rows, then set to All", async () => {
    // Add local setting for asup.simple-table.test-table.settings
    window.localStorage.setItem(
      "asup.simple-table.test-table.settings",
      JSON.stringify({
        headerWidths: [
          { name: "hierarchyLabel", width: "200px" },
          { name: "displayName", width: "300px" },
        ],
        pageRows: "50",
      }),
    );

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
    const pagerSelect = screen.getByLabelText("Visible rows");
    expect(pagerSelect).toBeInTheDocument();
    expect(pagerSelect).toHaveValue("50");

    // Now set to "All"
    const user = userEvent.setup();
    await act(async () => await user.selectOptions(pagerSelect, "All"));
    expect(pagerSelect).toHaveValue("All");
    const settings = window.localStorage.getItem("asup.simple-table.test-table.settings") as string;
    const parsedSettings = JSON.parse(settings);
    expect(parsedSettings.pageRows).toEqual("Infinity");

    window.localStorage.removeItem("asup.simple-table.test-table.settings");
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
    const user = userEvent.setup();
    const ReloadingTable = () => {
      const [show, setShow] = useState<boolean>(true);
      return (
        <div>
          <button
            onClick={() => setShow(!show)}
            data-testid="show-button"
          />
          {show && (
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
            />
          )}
        </div>
      );
    };
    // Add old setting
    window.localStorage.setItem(
      "asup.simple-table.test-table.settings",
      JSON.stringify({ headerWidths: [null, "0px"] }),
    );
    await act(async () => render(<ReloadingTable />));
    const handles = screen.getAllByRole("separator");
    const firstHandle = handles[0];
    fireEvent.mouseDown(firstHandle);
    fireEvent.mouseMove(firstHandle, { clientX: 400 });
    fireEvent.mouseUp(firstHandle);
    expect(mockOnWidthChange).toHaveBeenLastCalledWith([
      { name: mockFields.filter((f) => !f.hidden)[0].name, width: "400px" },
    ]);
    fireEvent.mouseDown(firstHandle);
    fireEvent.mouseMove(firstHandle, { clientX: 200 });
    fireEvent.mouseUp(firstHandle);
    expect(mockOnWidthChange).toHaveBeenLastCalledWith([
      { name: mockFields.filter((f) => !f.hidden)[0].name, width: "200px" },
    ]);
    // Hide table
    const showButton = screen.getByTestId("show-button");
    await act(async () => await user.click(showButton));
    expect(screen.queryByText("TEST TABLE")).not.toBeInTheDocument();
    // Show table again
    await act(async () => await user.click(showButton));
    expect(screen.queryByText("TEST TABLE")).toBeInTheDocument();
    const handles2 = screen.getAllByRole("separator");
    const secondHandle = handles2[1];
    fireEvent.mouseDown(secondHandle);
    fireEvent.mouseMove(secondHandle, { clientX: 300 });
    fireEvent.mouseUp(secondHandle);
    const settings = window.localStorage.getItem("asup.simple-table.test-table.settings") as string;
    const headerWidths = JSON.parse(settings).headerWidths as { name: string; width: string }[];
    expect(
      headerWidths.find((f) => f.name === mockFields.filter((f) => !f.hidden)[0].name)?.width,
    ).toEqual("200px");
    expect(
      headerWidths.find((f) => f.name === mockFields.filter((f) => !f.hidden)[1].name)?.width,
    ).toEqual("300px");
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
    expect(container.querySelectorAll("#test-table > tbody > tr").length).toEqual(
      mockAccesses.length * 500,
    );
  });

  test("Bad sort function handled", async () => {
    const mockFieldsBad: ISimpleTableField[] = [
      { name: "userId", label: "User ID", hidden: true },
      {
        name: "hierarchyLabel",
        label: "Hierarchy",
        sortFn: () => {
          throw new Error("Bad sort function");
        },
      },
    ];
    Object.defineProperty(console, "warn", { value: jest.fn() });
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
    const testFields: ISimpleTableField[] = [
      { name: "userId", label: "User ID", hidden: false },
      ...mockFields.slice(1),
    ];
    const testData = Array(100)
      .fill(mockAccesses)
      .flat()
      .map((_, i) => ({ ..._, userId: i }));
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
            fields={testFields}
            keyField={"userId"}
            data={testData}
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
    const last = screen.queryByLabelText("Go to last page") as Element;
    await act(async () => await user.click(last));
    // Expect last cell to be shown
    expect(
      container.querySelector("#test-table > tbody > tr:last-child > td:first-child")?.textContent,
    ).toEqual("299");
    // Apply filter
    await act(async () => await user.click(screen.getByLabelText("FILTER HERE")));
    expect(
      container.querySelector("#test-table > tbody > tr:first-child > td:first-child")?.textContent,
    ).toEqual("1");
  });

  test("Fields without width use default column widths", async () => {
    // Test with fields that have no width property - covers line 132
    const fieldsNoWidth: ISimpleTableField[] = [
      { name: "userId", label: "User ID", hidden: true },
      { name: "hierarchyLabel", label: "Hierarchy" },
      { name: "displayName", label: "Display name" },
    ];
    await act(async () =>
      render(
        <SimpleTable
          id="test-table"
          headerLabel="TEST TABLE"
          fields={fieldsNoWidth}
          keyField={"userId"}
          data={mockAccesses}
        />,
      ),
    );
    expect(screen.queryByText("TEST TABLE")).toBeInTheDocument();
    expect(screen.queryByText("Hierarchy")).toBeInTheDocument();
  });

  test("Column filter reduces view data", async () => {
    // Test with column filters active - covers lines 204-205
    const user = userEvent.setup();
    const fieldsWithFilter: ISimpleTableField[] = [
      { name: "userId", label: "User ID", hidden: true },
      {
        name: "hierarchyLabel",
        label: "Hierarchy",
        canColumnFilter: true,
      },
      { name: "displayName", label: "Display name" },
      {
        name: "accessLevel",
        label: "Access level",
        canColumnFilter: true,
      },
    ];
    await act(async () =>
      render(
        <div data-testid="container">
          <SimpleTable
            id="test-table"
            headerLabel="TEST TABLE"
            fields={fieldsWithFilter}
            keyField={"userId"}
            data={mockAccesses}
          />
        </div>,
      ),
    );
    const container = screen.getByTestId("container");
    // Should show all rows initially
    expect(container.querySelectorAll("#test-table > tbody > tr").length).toEqual(3);

    // Click on the column filter icon for Hierarchy (first filter icon)
    const filterIcons = screen.getAllByLabelText("Column filter");
    expect(filterIcons[0]).toBeInTheDocument();
    await user.click(filterIcons[0]);

    // Select only "Corporate" from the filter
    const corporateCheckbox = screen.getByLabelText("Corporate");

    // Uncheck all first
    await user.click(screen.getByLabelText("Column filter toggle"));
    // Then check only Corporate
    await user.click(corporateCheckbox.parentElement!);

    // Close the filter
    const closeButton = screen.getByLabelText("Close filter");
    await user.click(closeButton);

    // Should now only show 1 row (Corporate)
    expect(container.querySelectorAll("#test-table > tbody > tr").length).toEqual(1);
    expect(screen.queryByText("User-view")).toBeInTheDocument();
    expect(screen.queryByText("User-admin")).not.toBeInTheDocument();
    expect(screen.queryByText("User-lead")).not.toBeInTheDocument();
  });

  test("Column filter shows all values excluding filters on other columns (Excel-like behavior)", async () => {
    // Test that currentColumnItems excludes the filter on its own column but includes other filters
    // Mock data reminder:
    // - Some TA -> admin (3)
    // - SubHierarchy -> lead (0)
    // - Corporate -> viewer (2)
    const user = userEvent.setup();
    const fieldsWithFilter: ISimpleTableField[] = [
      { name: "userId", label: "User ID", hidden: true },
      {
        name: "hierarchyLabel",
        label: "Hierarchy",
        canColumnFilter: true,
      },
      {
        name: "accessLevel",
        label: "Access level",
        canColumnFilter: true,
      },
    ];
    await act(async () =>
      render(
        <div data-testid="container">
          <SimpleTable
            id="test-table"
            headerLabel="TEST TABLE"
            fields={fieldsWithFilter}
            keyField={"userId"}
            data={mockAccesses}
          />
        </div>,
      ),
    );

    const filterIcons = screen.getAllByLabelText("Column filter");

    // PART 1: Filter Hierarchy to "Corporate" only
    await user.click(filterIcons[0]); // Open Hierarchy filter

    // All three hierarchy values should be available initially (no filters yet)
    expect(screen.getByLabelText("Some TA")).toBeInTheDocument();
    expect(screen.getByLabelText("SubHierarchy")).toBeInTheDocument();
    expect(screen.getByLabelText("Corporate")).toBeInTheDocument();

    // Select only "Corporate"
    await user.click(screen.getByLabelText("Column filter toggle")); // Uncheck all
    await user.click(screen.getByLabelText("Corporate").parentElement!); // Check only Corporate
    await user.click(screen.getByLabelText("Close filter")); // Close

    // PART 2: Open Access level filter - should only show "2" (viewer)
    // because that's the only access level in Corporate (the Hierarchy filter affects this)
    await user.click(filterIcons[1]); // Open Access level filter

    expect(screen.queryByLabelText("0")).not.toBeInTheDocument(); // lead - not in Corporate
    expect(screen.getByLabelText("2")).toBeInTheDocument(); // viewer - in Corporate
    expect(screen.queryByLabelText("3")).not.toBeInTheDocument(); // admin - not in Corporate

    // This demonstrates that OTHER column filters affect available values
  });
});

// Mock data reminder for cascading slicer tests:
// - User-admin:  hierarchyLabel="Some TA",     accessLevel=3 (admin)
// - User-lead:   hierarchyLabel="SubHierarchy", accessLevel=0 (lead)
// - User-view:   hierarchyLabel="Corporate",    accessLevel=2 (viewer)
// filterOutFn on accessLevel filters OUT admin (accessLevel === eAccessLevel.admin === 3)
// searchFn on hierarchyLabel matches rows whose hierarchyLabel contains the search text
const cascadeFields: ISimpleTableField[] = [
  { name: "userId", label: "User ID", hidden: true },
  {
    name: "hierarchyLabel",
    label: "Hierarchy",
    searchFn: (rowData, searchText) =>
      (rowData.hierarchyLabel as string).toLowerCase().includes(searchText.toLowerCase().trim()),
    canColumnFilter: true,
  },
  {
    name: "accessLevel",
    label: "Access level",
    filterOutFn: (rowData) => (rowData.accessLevel as eAccessLevel) === eAccessLevel.admin,
    canColumnFilter: true,
  },
];

describe("Cascading slicer (column filter) behavior", () => {
  test("Global filterFn removes values from slicer options", async () => {
    // When the global filter checkbox is active, filterOutFn removes admin rows from the base
    // used to build slicer options — so "Some TA" and accessLevel "3" should NOT appear
    const user = userEvent.setup();
    await act(async () =>
      render(
        <div data-testid="container">
          <SimpleTable
            id="test-table"
            headerLabel="TEST TABLE"
            fields={cascadeFields}
            keyField="userId"
            data={mockAccesses}
            showFilter={true}
            showSearch={false}
            filterLabel="FILTER HERE"
          />
        </div>,
      ),
    );

    // Activate global filter (now filterFn excludes admin rows from baseForColumnItems)
    const filterCheckbox = screen.getByRole("checkbox");
    await user.click(filterCheckbox);

    const filterIcons = screen.getAllByLabelText("Column filter");

    // Hierarchy slicer: "Some TA" belongs to admin, so it must not appear
    await user.click(filterIcons[0]);
    expect(screen.queryByLabelText("Some TA")).not.toBeInTheDocument();
    expect(screen.getByLabelText("SubHierarchy")).toBeInTheDocument();
    expect(screen.getByLabelText("Corporate")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close filter"));

    // Access level slicer: "3" (admin) must not appear
    await user.click(filterIcons[1]);
    expect(screen.queryByLabelText("3")).not.toBeInTheDocument();
    expect(screen.getByLabelText("0")).toBeInTheDocument();
    expect(screen.getByLabelText("2")).toBeInTheDocument();
  });

  test("Search (searchFn) narrows slicer options to matching rows only", async () => {
    // Typing "TA" matches only the "Some TA" hierarchy row via its searchFn
    // Slicer options should therefore only reflect that one row
    const user = userEvent.setup();
    await act(async () =>
      render(
        <div data-testid="container">
          <SimpleTable
            id="test-table"
            headerLabel="TEST TABLE"
            fields={cascadeFields}
            keyField="userId"
            data={mockAccesses}
            showFilter={false}
            showSearch={true}
          />
        </div>,
      ),
    );

    const searchBox = screen.getByRole("searchbox");
    await act(async () => await user.type(searchBox, "TA"));
    expect(searchBox).toHaveValue("TA");

    const filterIcons = screen.getAllByLabelText("Column filter");

    // Hierarchy slicer: only "Some TA" should appear
    await user.click(filterIcons[0]);
    expect(screen.getByLabelText("Some TA")).toBeInTheDocument();
    expect(screen.queryByLabelText("SubHierarchy")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Corporate")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Close filter"));

    // Access level slicer: only "3" (admin, the user in "Some TA") should appear
    await user.click(filterIcons[1]);
    expect(screen.getByLabelText("3")).toBeInTheDocument();
    expect(screen.queryByLabelText("0")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("2")).not.toBeInTheDocument();
  });

  test("A column's own active filter does not restrict its own slicer option list", async () => {
    // After filtering Hierarchy to "Corporate", reopening the Hierarchy slicer
    // must still show all three values (own-column filter is excluded from its own base)
    const user = userEvent.setup();
    await act(async () =>
      render(
        <div data-testid="container">
          <SimpleTable
            id="test-table"
            headerLabel="TEST TABLE"
            fields={cascadeFields}
            keyField="userId"
            data={mockAccesses}
          />
        </div>,
      ),
    );

    // Set Hierarchy filter to "Corporate" only
    await user.click(screen.getAllByLabelText("Column filter")[0]);
    await user.click(screen.getByLabelText("Column filter toggle")); // uncheck all
    await user.click(screen.getByLabelText("Corporate").parentElement!); // check Corporate
    await user.click(screen.getByLabelText("Close filter"));

    // After filtering, the Hierarchy icon becomes "Column filter (Active)" — re-query it
    // Reopen Hierarchy slicer — all three values must still be present
    await user.click(screen.getByLabelText("Column filter (Active)"));
    expect(screen.getByLabelText("Some TA")).toBeInTheDocument();
    expect(screen.getByLabelText("SubHierarchy")).toBeInTheDocument();
    expect(screen.getByLabelText("Corporate")).toBeInTheDocument();
  });

  test("Cross-filter: multiple column filters combine with AND and cascade options correctly", async () => {
    // Filter Hierarchy to "Corporate" + "SubHierarchy"
    // viewData should contain 2 rows (viewer + lead)
    // Access level slicer should show "0" and "2" but NOT "3" (admin has "Some TA")
    const user = userEvent.setup();
    await act(async () =>
      render(
        <div data-testid="container">
          <SimpleTable
            id="test-table"
            headerLabel="TEST TABLE"
            fields={cascadeFields}
            keyField="userId"
            data={mockAccesses}
          />
        </div>,
      ),
    );

    const container = screen.getByTestId("container");

    // Filter Hierarchy to "Corporate" and "SubHierarchy" (exclude "Some TA" / admin)
    await user.click(screen.getAllByLabelText("Column filter")[0]);
    await user.click(screen.getByLabelText("Column filter toggle")); // uncheck all
    await user.click(screen.getByLabelText("Corporate").parentElement!);
    await user.click(screen.getByLabelText("SubHierarchy").parentElement!);
    await user.click(screen.getByLabelText("Close filter"));

    // Confirm only 2 rows visible (Corporate=viewer + SubHierarchy=lead; Some TA=admin excluded)
    expect(container.querySelectorAll("#test-table > tbody > tr").length).toEqual(2);
    expect(screen.queryByText("Corporate")).toBeInTheDocument();
    expect(screen.queryByText("SubHierarchy")).toBeInTheDocument();
    expect(screen.queryByText("Some TA")).not.toBeInTheDocument();

    // After filtering, the Hierarchy icon becomes "Column filter (Active)".
    // Access level is still inactive — re-query to get the correct live element.
    await user.click(screen.getByLabelText("Column filter"));
    expect(screen.getByLabelText("0")).toBeInTheDocument(); // lead
    expect(screen.getByLabelText("2")).toBeInTheDocument(); // viewer
    expect(screen.queryByLabelText("3")).not.toBeInTheDocument(); // admin excluded by Hierarchy filter
  });
});
