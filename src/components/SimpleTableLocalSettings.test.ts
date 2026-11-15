import {
  isSimpleTableLocalSettings,
  resolveSimpleTableLocalSettings,
} from "./SimpleTableLocalSettings";

describe("isSimpleTableLocalSettings", () => {
  test.each([
    ["empty settings", {}],
    ["page row count as a number", { pageRows: 25 }],
    ["page row count as a string", { pageRows: "Infinity" }],
    ["column widths", { headerWidths: [{ name: "name", width: "200px" }] }],
    ["legacy column widths", { headerWidths: ["200px", undefined] }],
    ["legacy column widths with null entries", { headerWidths: [null, "200px"] }],
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
    ["a numeric column width", { headerWidths: [200] }],
    ["an unnamed column width", { headerWidths: [{ width: "200px" }] }],
    ["a column width without a width", { headerWidths: [{ name: "name" }] }],
    [
      "mixed legacy and named column widths",
      { headerWidths: ["200px", { name: "name", width: "300px" }] },
    ],
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

describe("resolveSimpleTableLocalSettings", () => {
  test("returns null for invalid settings", () => {
    expect(resolveSimpleTableLocalSettings({ headerWidths: [200] }, ["name"])).toBeNull();
  });

  test("preserves current named column widths", () => {
    const settings = { headerWidths: [{ name: "name", width: "200px" }] };

    expect(resolveSimpleTableLocalSettings(settings, ["name"])).toEqual(settings);
  });

  test("converts legacy widths to named widths and skips missing entries", () => {
    expect(
      resolveSimpleTableLocalSettings({ headerWidths: [null, "200px", undefined, "400px"] }, [
        "first",
        "second",
        "third",
      ]),
    ).toEqual({ headerWidths: [{ name: "second", width: "200px" }] });
  });

  test("preserves settings that do not contain column widths", () => {
    const settings = { pageRows: 25 };

    expect(resolveSimpleTableLocalSettings(settings, ["name"])).toEqual(settings);
  });
});
