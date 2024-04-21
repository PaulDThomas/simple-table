import { render, screen } from "@testing-library/react";
import { convertDateToLocaleString } from "./convertDates";
import { simpleTableNullDate } from "./simpleTableNullDate";

describe("Test print date function", () => {
  test("Correctly process null", async () => {
    render(
      <div data-testid='cell'>
        {simpleTableNullDate({
          rowData: { date: null },
          cellField: "date",
          field: { name: "date" },
          columnNumber: 1,
          rowNumber: 0,
        })}
      </div>,
    );
    expect(screen.queryByTestId("cell")).toHaveTextContent("");
  });
  test("Correctly process date", async () => {
    render(
      <div data-testid='cell'>
        {simpleTableNullDate({
          rowData: { date: new Date("2022-01-01") },
          cellField: "date",
          field: { name: "date" },
          columnNumber: 1,
          rowNumber: 0,
        })}
      </div>,
    );
    expect(screen.queryByTestId("cell")).toHaveTextContent(
      convertDateToLocaleString("2022-01-01 00:00Z"),
    );
  });
  test("Correctly process string", async () => {
    render(
      <div data-testid='cell'>
        {simpleTableNullDate({
          rowData: { date: "2022-01-01" },
          cellField: "date",
          field: { name: "date" },
          columnNumber: 1,
          rowNumber: 0,
        })}
      </div>,
    );
    expect(screen.queryByTestId("cell")).toHaveTextContent("2022-01-01");
  });
});
