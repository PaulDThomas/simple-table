import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { ISimpleTableField, ISimpleTableRow } from "./interface";
import { defaultContext, SimpleTableContext } from "./SimpleTableContext";
import { SimpleTableRow } from "./SimpleTableRow";

const mockFields: ISimpleTableField[] = [
  { name: "userId", hidden: true, label: "UserId" },
  { name: "displayName", label: "Display name" },
];

const mockData: ISimpleTableRow = {
  userId: 3,
  displayName: "Some user",
};

const mockToggle = jest.fn();
describe("Access rights row rendering", () => {
  test("Basic render", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          ...defaultContext,
          id: "testtable",
          fields: mockFields,
          keyField: "userId",
          viewData: [mockData],
          totalRows: [mockData].length,
          selectable: true,
        }}
      >
        <table>
          <tbody>
            <SimpleTableRow
              rowNumber={0}
              rowId={3}
            />
          </tbody>
        </table>
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByText("3")).not.toBeInTheDocument();
    expect(screen.queryByText("Some user")).toBeInTheDocument();
  });
  test("Render and click", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          ...defaultContext,
          id: "testtable",
          fields: mockFields,
          keyField: "userId",
          viewData: [mockData],
          totalRows: [mockData].length,
          firstRow: 0,
          pageRows: 50,
          selectable: true,
          currentSelection: [3],
          toggleSelection: mockToggle,
        }}
      >
        <table>
          <tbody>
            <SimpleTableRow
              rowNumber={0}
              rowId={3}
            />
          </tbody>
        </table>
      </SimpleTableContext.Provider>,
    );
    const check = screen.getByRole("checkbox");
    expect(check).toBeInTheDocument();
    act(() => {
      fireEvent.click(check);
    });
    expect(mockToggle).toHaveBeenCalledWith(3);
  });
});
