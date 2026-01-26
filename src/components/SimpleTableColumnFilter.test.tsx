import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { SimpleTableColumnFilter } from "./SimpleTableColumnFilter";
import { defaultContext, ISimpleTableColumnFilter, SimpleTableContext } from "./SimpleTableContext";
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

describe("SimpleTableColumnFilter", () => {
  const MockComponent = ({
    currentColumnFilter = null,
    currentColumnFilters = [],
    setCurrentColumnFilter = jest.fn(),
    setCurrentColumnFilters = jest.fn(),
  }: {
    currentColumnFilter?: number | null;
    currentColumnFilters?: ISimpleTableColumnFilter[];
    setCurrentColumnFilter?: (ret: number | null) => void;
    setCurrentColumnFilters?: (ret: ISimpleTableColumnFilter[]) => void;
  }) => (
    <SimpleTableContext.Provider
      value={{
        ...defaultContext,
        id: "testtable",
        fields: mockFields,
        keyField: "userId",
        viewData: mockData,
        totalRows: mockData.length,
        currentColumnItems: [
          {
            columnName: "displayName",
            values: ["Lead", "Tester 1", "Tester 2", "Tester 3", "Tester 4", "Other user"],
          },
        ],
        currentColumnFilter,
        currentColumnFilters,
        setCurrentColumnFilter,
        setCurrentColumnFilters,
      }}
    >
      <SimpleTableColumnFilter columnName={"displayName"} />
    </SimpleTableContext.Provider>
  );

  test("Safely render without column info", async () => {
    await act(async () => render(<SimpleTableColumnFilter columnName={"displayName"} />));
    expect(screen.queryByText("0 items selected")).toBeInTheDocument();
  });

  test("Basic render", async () => {
    const mockSet = jest.fn();
    const mockSetCurrentFilter = jest.fn();
    await act(async () =>
      render(
        <MockComponent
          currentColumnFilter={0}
          setCurrentColumnFilter={mockSetCurrentFilter}
          currentColumnFilters={[{ columnName: "displayName", values: ["Lead", "Other user"] }]}
          setCurrentColumnFilters={mockSet}
        />,
      ),
    );
    expect(screen.queryByText("2 items selected")).toBeInTheDocument();
    expect(screen.queryByLabelText("Column filter search")).toBeInTheDocument();
    expect(screen.queryByLabelText("Column filter toggle")).toBeInTheDocument();
    expect(screen.queryByLabelText("Other user")).toBeInTheDocument();
    expect(screen.queryByLabelText("Other user")).toBeChecked();
  });

  test("Type into filter", async () => {
    const user = userEvent.setup();
    const mockSet = jest.fn();
    const mockSetCurrentFilter = jest.fn();
    await act(async () => {
      render(
        <MockComponent
          currentColumnFilters={[]}
          setCurrentColumnFilter={mockSetCurrentFilter}
          setCurrentColumnFilters={mockSet}
        />,
      );
    });
    const search = screen.queryByLabelText("Column filter search") as HTMLInputElement;
    expect(screen.queryByLabelText("Lead")).toBeInTheDocument();
    await act(async () => await user.type(search, "Te"));
    expect(screen.queryByLabelText("Lead")).toBeInTheDocument();
    expect(screen.queryByLabelText("Lead")).not.toBeChecked();
    await act(async () => await user.type(search, "{enter}"));
    expect(mockSetCurrentFilter).toHaveBeenCalledWith(null);
    expect(mockSet).toHaveBeenCalledWith([
      { columnName: "displayName", values: ["Tester 1", "Tester 2", "Tester 3", "Tester 4"] },
    ]);
  });

  test("Check and uncheck all items", async () => {
    const user = userEvent.setup();
    const mockSet = jest.fn();
    const mockSetCurrentFilter = jest.fn();
    await act(async () => {
      render(
        <MockComponent
          currentColumnFilters={[{ columnName: "displayName", values: ["Other user"] }]}
          setCurrentColumnFilter={mockSetCurrentFilter}
          setCurrentColumnFilters={mockSet}
        />,
      );
    });
    const toggle = screen.queryByLabelText("Column filter toggle") as HTMLInputElement;
    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();
    expect(screen.queryByText("1 item selected")).toBeInTheDocument();
    await user.click(toggle);
    expect(screen.queryByText("6 items selected")).toBeInTheDocument();
    expect(toggle).toBeChecked();
    await user.click(toggle);
    expect(toggle).not.toBeChecked();
    expect(screen.queryByText("0 items selected")).toBeInTheDocument();
    // Close screen
    const closeButton = screen.queryByLabelText("Close filter");
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton!);
    expect(mockSet).toHaveBeenCalledWith([{ columnName: "displayName", values: [] }]);
    expect(mockSetCurrentFilter).toHaveBeenCalledWith(null);
  });

  test("Remove existing filter by selecting all", async () => {
    const user = userEvent.setup();
    const mockSet = jest.fn();
    const mockSetCurrentFilter = jest.fn();
    await act(async () => {
      render(
        <MockComponent
          currentColumnFilters={[{ columnName: "displayName", values: ["Tester 1"] }]}
          setCurrentColumnFilter={mockSetCurrentFilter}
          setCurrentColumnFilters={mockSet}
        />,
      );
    });
    const toggle = screen.queryByLabelText("Column filter toggle") as HTMLInputElement;
    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();
    expect(screen.queryByText("1 item selected")).toBeInTheDocument();
    await user.click(toggle);
    expect(screen.queryByText("6 items selected")).toBeInTheDocument();
    expect(toggle).toBeChecked();

    // Close screen
    const closeButton = screen.queryByLabelText("Close filter");
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton!);
    expect(mockSetCurrentFilter).toHaveBeenCalledWith(null);
    expect(mockSet).toHaveBeenCalledWith([]);
  });

  test("Toggle search filter", async () => {
    const user = userEvent.setup();
    const mockSet = jest.fn();
    const mockSetCurrentFilter = jest.fn();
    await act(async () => {
      render(
        <MockComponent
          currentColumnFilters={[]}
          setCurrentColumnFilter={mockSetCurrentFilter}
          setCurrentColumnFilters={mockSet}
        />,
      );
    });
    const allToggle = screen.queryByLabelText("Column filter toggle") as HTMLInputElement;
    expect(allToggle).toBeInTheDocument();
    expect(allToggle).toBeChecked();
    const searchToggle = screen.queryByLabelText("Column search filter toggle") as HTMLInputElement;
    expect(searchToggle).toBeInTheDocument();
    expect(searchToggle).not.toBeChecked();

    const search = screen.queryByLabelText("Column filter search") as HTMLInputElement;
    expect(search).toBeInTheDocument();
    await user.type(search, "Te");

    // Expect testers to be checked
    expect(searchToggle).toBeChecked();
    expect(allToggle.indeterminate).toBe(true);
    expect(screen.queryByText("4 items selected")).toBeInTheDocument();
    expect(screen.queryByLabelText("Tester 1")).toBeInTheDocument();
    expect(screen.queryByLabelText("Tester 1")).toBeChecked();

    // Uncheck match
    const matchToggle = screen.queryByLabelText("Match search filter") as HTMLInputElement;
    expect(matchToggle).toBeInTheDocument();
    expect(matchToggle).toBeChecked();
    await user.click(matchToggle);
    expect(screen.queryByText("4 items selected")).toBeInTheDocument();

    // Remove current search item
    expect(screen.queryByLabelText("Tester 4")).toBeInTheDocument();
    expect(screen.queryByLabelText("Tester 4")).toBeChecked();
    await user.click(screen.queryByLabelText("Tester 4")!.parentElement!);
    expect(screen.queryByLabelText("Tester 4")).not.toBeChecked();
    expect(screen.queryByText("3 items selected")).toBeInTheDocument();
    expect(searchToggle.indeterminate).toBe(true);

    // Toggle back up to 4 items
    await user.click(searchToggle);
    expect(screen.queryByLabelText("Tester 4")).toBeChecked();
    expect(screen.queryByText("4 items selected")).toBeInTheDocument();

    // Add different search text
    await user.clear(search);
    await user.type(search, "oth");
    expect(screen.queryByText("1 item selected")).toBeInTheDocument();
    const otherUserToggle = screen.queryByLabelText("Other user");
    expect(otherUserToggle).toBeInTheDocument();
    expect(otherUserToggle).toBeChecked();

    // Non-matching items stay visible but unchecked
    expect(screen.queryByLabelText("Tester 2")).toBeInTheDocument();
    expect(screen.queryByLabelText("Tester 2")).not.toBeChecked();

    // Clear search selection
    await user.click(searchToggle);
    expect(screen.queryByLabelText("Other user")).not.toBeChecked();
    expect(searchToggle).not.toBeChecked();
    expect(searchToggle.indeterminate).toBe(false);
    expect(matchToggle).not.toBeChecked();
    expect(screen.queryByText("0 items selected")).toBeInTheDocument();
  });

  test("shows No matching items when search has no results", async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(
        <MockComponent
          currentColumnFilters={[]}
          setCurrentColumnFilter={jest.fn()}
          setCurrentColumnFilters={jest.fn()}
        />,
      );
    });

    const search = screen.getByLabelText("Column filter search") as HTMLInputElement;
    await user.clear(search);
    await user.type(search, "zzz");

    expect(screen.getByText("No matching items")).toBeInTheDocument();
    // Non-matching items remain available below the separator
    expect(screen.getByLabelText("Tester 1")).toBeInTheDocument();
  });

  test("clicking a body row checkbox toggles selection", async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(
        <MockComponent
          currentColumnFilters={[]}
          setCurrentColumnFilter={jest.fn()}
          setCurrentColumnFilters={jest.fn()}
        />,
      );
    });

    // All six items selected initially
    expect(screen.getByText("6 items selected")).toBeInTheDocument();

    const tester3 = screen.getByLabelText("Tester 3");
    expect(tester3).toBeChecked();

    // Toggle off via container click to exercise selectBodyRow path
    await user.click(tester3.parentElement!);
    expect(tester3).not.toBeChecked();
    expect(screen.getByText("5 items selected")).toBeInTheDocument();

    // Toggle back on
    await user.click(tester3.parentElement!);
    expect(tester3).toBeChecked();
    expect(screen.getByText("6 items selected")).toBeInTheDocument();
  });

  test("handleFilterChange toggles match search on type and clear", async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(
        <MockComponent
          currentColumnFilters={[]}
          setCurrentColumnFilter={jest.fn()}
          setCurrentColumnFilters={jest.fn()}
        />,
      );
    });

    const search = screen.getByLabelText("Column filter search") as HTMLInputElement;
    const matchToggle = screen.getByLabelText("Match search filter") as HTMLInputElement;
    const searchToggle = screen.getByLabelText("Column search filter toggle") as HTMLInputElement;
    const allToggle = screen.getByLabelText("Column filter toggle") as HTMLInputElement;

    // Type first character: match search should enable and filtered selections should apply
    await user.type(search, "T");
    expect(matchToggle).toBeChecked();
    expect(searchToggle).toBeChecked();
    expect(allToggle.indeterminate).toBe(true);
    expect(screen.getByText("5 items selected")).toBeInTheDocument();

    // Continue typing while non-empty: retain match search state
    await user.type(search, "e");
    expect(matchToggle).toBeChecked();
    expect(searchToggle).toBeChecked();
    expect(screen.getByText("4 items selected")).toBeInTheDocument();

    // Clearing search should disable match search and restore full selection
    await user.clear(search);
    expect(matchToggle).not.toBeChecked();
    expect(searchToggle).not.toBeChecked();
    expect(searchToggle.indeterminate).toBe(false);
    expect(allToggle).toBeChecked();
    expect(screen.getByText("6 items selected")).toBeInTheDocument();
  });

  test("Close filter when no setCurrentColumnFilters available", async () => {
    const mockSetCurrentFilter = jest.fn();
    await act(async () => {
      render(
        <MockComponent
          currentColumnFilters={[]}
          setCurrentColumnFilter={mockSetCurrentFilter}
          setCurrentColumnFilters={
            undefined as unknown as (ret: ISimpleTableColumnFilter[]) => void
          }
        />,
      );
    });
    // Should still render
    expect(screen.queryByText("6 items selected")).toBeInTheDocument();
  });

  test("Toggle search filter with empty search text does nothing", async () => {
    const user = userEvent.setup();
    const mockSet = jest.fn();
    const mockSetCurrentFilter = jest.fn();
    await act(async () => {
      render(
        <MockComponent
          currentColumnFilters={[]}
          setCurrentColumnFilter={mockSetCurrentFilter}
          setCurrentColumnFilters={mockSet}
        />,
      );
    });
    const searchToggle = screen.queryByLabelText("Column search filter toggle") as HTMLInputElement;
    expect(searchToggle).toBeInTheDocument();
    // Click with empty search - should not change anything
    await user.click(searchToggle.parentElement!);
    expect(screen.queryByText("6 items selected")).toBeInTheDocument();
  });

  test("Handle existing filter index", async () => {
    const user = userEvent.setup();
    const mockSet = jest.fn();
    const mockSetCurrentFilter = jest.fn();
    await act(async () => {
      render(
        <MockComponent
          currentColumnFilters={[{ columnName: "displayName", values: ["Lead"] }]}
          setCurrentColumnFilter={mockSetCurrentFilter}
          setCurrentColumnFilters={mockSet}
        />,
      );
    });
    expect(screen.queryByText("1 item selected")).toBeInTheDocument();
    // Close should update existing filter
    const closeButton = screen.queryByLabelText("Close filter");
    await user.click(closeButton!);
    expect(mockSet).toHaveBeenCalled();
  });
});
