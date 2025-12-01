import { render, screen } from "@testing-library/react";
import { SimpleTableNullDate } from "./SimpleTableNullDate";

describe("Test print date function", () => {
  test("Correctly process null", async () => {
    render(
      <div data-testid="cell">
        <SimpleTableNullDate
          rowData={{ date: null }}
          cellField="date"
          field={{ name: "date" }}
          columnNumber={1}
          rowNumber={0}
        />
      </div>,
    );
    expect(screen.queryByTestId("cell")).toHaveTextContent("");
  });
  test("Correctly process date", async () => {
    render(
      <div data-testid="cell">
        <SimpleTableNullDate
          rowData={{ date: new Date("2022-01-01") }}
          cellField="date"
          field={{ name: "date" }}
          columnNumber={1}
          rowNumber={0}
        />
      </div>,
    );
    expect(screen.queryByTestId("cell")).toHaveTextContent("2022-01-01 00:00");
  });

  test("Correctly processes string date", async () => {
    render(
      <div data-testid="cell">
        <SimpleTableNullDate
          rowData={{ date: "2022-01-01T00:00:00Z" }}
          cellField="date"
          field={{ name: "date" }}
          columnNumber={1}
          rowNumber={0}
        />
      </div>,
    );
    expect(screen.queryByTestId("cell")).toHaveTextContent("2022-01-01 00:00");
  });
  test("Correctly process string", async () => {
    render(
      <div data-testid="cell">
        <SimpleTableNullDate
          rowData={{ date: "2022-01-01" }}
          cellField="date"
          field={{ name: "date" }}
          columnNumber={1}
          rowNumber={0}
        />
      </div>,
    );
    expect(screen.queryByTestId("cell")).toHaveTextContent("2022-01-01");
  });
});
