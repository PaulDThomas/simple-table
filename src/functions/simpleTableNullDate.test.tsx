import { render, screen } from "@testing-library/react";
import {
  columnFilterValue,
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

describe("columnFilterValue", () => {
  test("should return string representation of a number", () => {
    expect(columnFilterValue(123)).toBe("123");
  });

  test("should return '<blank>' for an empty string", () => {
    expect(columnFilterValue("")).toBe("<blank>");
  });

  test("should return '<blank>' for null", () => {
    expect(columnFilterValue(null)).toBe("<blank>");
  });

  test("should return '<blank>' for undefined", () => {
    expect(columnFilterValue(undefined)).toBe("<blank>");
  });

  test("should return the string itself for non-empty strings", () => {
    expect(columnFilterValue("hello")).toBe("hello");
  });

  test("should return nowt", () => {
    expect(columnFilterValue(null, false)).toBe("");
    expect(columnFilterValue(undefined, false)).toBe("");
    expect(columnFilterValue("    ", false)).toBe("");
  });

  test("should return string representation of other data types", () => {
    expect(columnFilterValue(true)).toBe("true");
    expect(columnFilterValue(false)).toBe("false");
    expect(columnFilterValue({})).toBe("📦📦");
    expect(columnFilterValue([])).toBe("📃📃");
    expect(columnFilterValue(new Date("2023-01-01"))).toBe("2023-01-01 00:00");
    expect(columnFilterValue(() => {})).toBe("🛠️🛠️");
    expect(columnFilterValue(Symbol("symbol"))).toBe("⁉️⁉️");
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
