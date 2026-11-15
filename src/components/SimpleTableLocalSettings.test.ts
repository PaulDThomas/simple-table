import { isSimpleTableLocalSettings } from "./SimpleTableLocalSettings";

describe("isSimpleTableLocalSettings", () => {
  test.each([
    ["empty settings", {}],
    ["page row count as a number", { pageRows: 25 }],
    ["page row count as a string", { pageRows: "Infinity" }],
    ["column widths", { headerWidths: [{ name: "name", width: "200px" }] }],
    ["legacy column widths", { headerWidths: ["200px", undefined] }],
    ["ascending sort", { sortBy: { name: "name", asc: true } }],
    ["no sort", { sortBy: null }],
    ["filter toggle", { filterData: false }],
    ["search text", { searchText: "visible rows" }],
    ["column filters", { currentColumnFilters: [{ columnName: "name", values: ["Ada"] }] }],
  ])("accepts %s", (_label, settings) => {
    expect(isSimpleTableLocalSettings(settings)).toBe(true);
  });

  test.each([
    ["a string", "invalid"],
    ["null", null],
    ["an array", []],
    ["invalid page rows", { pageRows: { value: 25 } }],
    ["invalid header widths", { headerWidths: "200px" }],
    ["a string sort", { sortBy: "name" }],
    ["an array sort", { sortBy: [] }],
    ["a sort without a name", { sortBy: { asc: true } }],
    ["a sort with an invalid direction", { sortBy: { name: "name", asc: "yes" } }],
    ["an invalid filter toggle", { filterData: "yes" }],
    ["invalid search text", { searchText: 10 }],
    ["non-array column filters", { currentColumnFilters: "name" }],
    ["a primitive column filter", { currentColumnFilters: ["name"] }],
    ["a null column filter", { currentColumnFilters: [null] }],
    ["an array column filter", { currentColumnFilters: [[]] }],
    ["a filter without a column name", { currentColumnFilters: [{ values: ["Ada"] }] }],
    [
      "a filter with non-array values",
      { currentColumnFilters: [{ columnName: "name", values: "Ada" }] },
    ],
    [
      "a filter with non-string values",
      { currentColumnFilters: [{ columnName: "name", values: [1] }] },
    ],
  ])("rejects %s", (_label, settings) => {
    expect(isSimpleTableLocalSettings(settings)).toBe(false);
  });
});
