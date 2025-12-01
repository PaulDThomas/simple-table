import { convertDateToLocaleString } from "./convertDateToLocaleString";

describe("convert tests", () => {
  test("invalid convertDateToLocaleString", () => {
    expect(convertDateToLocaleString("invalid")).toBe("Invalid date");
  });

  test("convertDateToLocaleString", () => {
    // Mock Date object
    const getTimezoneOffset = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = jest.fn(() => -330);
    expect(convertDateToLocaleString(new Date("2022-01-01T00:00:00Z"))).toBe("2022-01-01 05:30");
    // Restore Date object
    Date.prototype.getTimezoneOffset = getTimezoneOffset;
  });
});
