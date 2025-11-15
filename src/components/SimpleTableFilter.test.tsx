import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ISimpleTableField, ISimpleTableRow } from "./interface";
import { defaultContext, SimpleTableContext } from "./SimpleTableContext";
import { SimpleTableFilter } from "./SimpleTableFilter";

const mockFilter = jest.fn();

const mockFields: ISimpleTableField[] = [
  { name: "tlfId", hidden: false },
  { name: "displayName", hidden: true, label: "Name", sortFn: mockFilter },
  { name: "description", hidden: true, label: "Description" },
];

const mockData: ISimpleTableRow[] = [
  { TlfId: 1, displayName: "Lead", description: "Magic lead" },
  { TlfId: 2, displayName: "Tester", description: "A tester" },
  { TlfId: 3, displayName: "Other user", description: "Important VIP" },
];

describe("Access rights filter rendering", () => {
  test("No context render", async () => {
    render(<SimpleTableFilter />);
    expect(screen.queryByText("Filter")).toBeInTheDocument();
  });

  test("Basic render", async () => {
    const user = userEvent.setup();
    render(
      <SimpleTableContext.Provider
        value={{
          ...defaultContext,
          id: "testtable",
          fields: mockFields,
          keyField: "userId",
          viewData: mockData,
          totalRows: mockData.length,
          filterLabel: "BIG FILTER",
          setFilterData: mockFilter,
        }}
      >
        <SimpleTableFilter />,
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText("BIG FILTER")).toBeInTheDocument();
    const filter = screen.getByRole("checkbox");
    await user.click(filter);
    expect(mockFilter).toHaveBeenCalledTimes(1);
  });
});
