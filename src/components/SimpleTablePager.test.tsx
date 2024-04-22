import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "@testing-library/react";
import { SimpleTableContext } from "./SimpleTableContext";
import { SimpleTablePager } from "./SimpleTablePager";
import { mockData } from "../__dummy__/mock_data";

describe("Simple table pager", () => {
  test("Basic render", async () => {
    render(
      <SimpleTableContext.Provider
        value={{
          id: "testtable",
          fields: [],
          keyField: "userId",
          viewData: mockData,
          totalRows: mockData.length,
          firstRow: 0,
          pageRows: Infinity,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <SimpleTablePager />
      </SimpleTableContext.Provider>,
    );
    expect(screen.queryByLabelText("Visible rows")).toBeInTheDocument();
    expect(screen.queryByLabelText("Go to first page")).toBeInTheDocument();
    expect(screen.queryByLabelText("Go to previous page")).toBeInTheDocument();
    expect(screen.queryByLabelText("Go to next page")).toBeInTheDocument();
    expect(screen.queryByLabelText("Go to last page")).toBeInTheDocument();
  });

  test("Button clicks", async () => {
    const user = userEvent.setup();
    const mockFirstRow = jest.fn();
    render(
      <SimpleTableContext.Provider
        value={{
          id: "testtable",
          fields: [],
          keyField: "userId",
          viewData: mockData,
          totalRows: mockData.length,
          firstRow: 100,
          setFirstRow: mockFirstRow,
          pageRows: 50,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <SimpleTablePager />
      </SimpleTableContext.Provider>,
    );
    await user.click(screen.getByLabelText("Go to first page"));
    expect(mockFirstRow).toHaveBeenCalledWith(0);
    await user.click(screen.getByLabelText("Go to previous page"));
    expect(mockFirstRow).toHaveBeenCalledWith(50);
    await user.click(screen.getByLabelText("Go to next page"));
    expect(mockFirstRow).toHaveBeenCalledWith(150);
    await user.click(screen.getByLabelText("Go to last page"));
    expect(mockFirstRow).toHaveBeenCalledWith(950);
  });

  test("Select options", async () => {
    const user = userEvent.setup();
    const mockPageRows = jest.fn();
    render(
      <SimpleTableContext.Provider
        value={{
          id: "testtable",
          fields: [],
          keyField: "userId",
          viewData: mockData,
          totalRows: 500,
          firstRow: 100,
          pageRows: 50,
          setPageRows: mockPageRows,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <SimpleTablePager />
      </SimpleTableContext.Provider>,
    );
    const rows = screen.getByLabelText("Visible rows") as HTMLSelectElement;
    fireEvent.change(rows, { target: { value: "All" } });
    expect(mockPageRows).toHaveBeenCalledWith(Infinity);
    await user.selectOptions(rows, "50");
    expect(mockPageRows).toHaveBeenCalledWith(50);
  });

  test("Select first row", async () => {
    const user = userEvent.setup();
    const mockFirstRow = jest.fn();
    render(
      <SimpleTableContext.Provider
        value={{
          id: "testtable",
          fields: [],
          keyField: "userId",
          viewData: mockData,
          totalRows: 500,
          firstRow: 100,
          pageRows: 50,
          setFirstRow: mockFirstRow,
          columnWidths: [],
          currentColumnItems: [],
          currentColumnFilter: null,
          currentColumnFilters: [],
        }}
      >
        <SimpleTablePager />
      </SimpleTableContext.Provider>,
    );
    const frow = screen.getByLabelText("First row") as HTMLSelectElement;
    fireEvent.change(frow, { target: { value: "250" } });
    expect(mockFirstRow).toHaveBeenCalledWith(250);
    await user.selectOptions(frow, "51");
    expect(mockFirstRow).toHaveBeenCalledWith(50);
  });
});
