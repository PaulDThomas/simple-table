import { render, screen } from "@testing-library/react";
import {
  convertDateToLocaleString,
  convertLocaleDateToUTCString,
  simpleTableNullDate,
} from "./simpleTableNullDate";

describe("Test print date function", () => {
  test("Correctly process null", async () => {
    render(
      <div data-testid="cell">
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
      <div data-testid="cell">
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
      <div data-testid="cell">
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

describe("convert tests", () => {
  test("invalid convertDateToLocaleString", () => {
    expect(convertDateToLocaleString("invalid")).toBe("Invalid date");
  });

  test("invalid convertLocaleDateToUTCString", () => {
    expect(convertLocaleDateToUTCString("invalid")).toBe("Invalid date");
  });

  test("convertDateToLocaleString", () => {
    // Mock Date object
    const getTimezoneOffset = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = jest.fn(() => -330);
    expect(convertDateToLocaleString(new Date("2022-01-01T00:00:00Z"))).toBe("2022-01-01 05:30");
    // Restore Date object
    Date.prototype.getTimezoneOffset = getTimezoneOffset;
  });

  test("convertLocaleDateToUTCString", () => {
    expect(convertLocaleDateToUTCString("2022-01-01T00:00:00+05:30")).toBe(
      "2021-12-31T18:30:00.000Z",
    );
  });
});
