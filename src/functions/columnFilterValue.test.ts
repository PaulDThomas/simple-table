import { ISimpleTableColumnFilterValueFn } from "components";
import { columnFilterValue } from "./columnFilterValue";

describe("columnFilterValue", () => {
  test("should return string representation of a number", () => {
    expect(columnFilterValue(123)).toEqual(["123"]);
  });

  test("should return '<blank>' for an empty string", () => {
    expect(columnFilterValue("")).toEqual(["<blank>"]);
  });

  test("should return '<blank>' for null", () => {
    expect(columnFilterValue(null)).toEqual(["<blank>"]);
  });

  test("should return '<blank>' for undefined", () => {
    expect(columnFilterValue(undefined)).toEqual(["<blank>"]);
  });

  test("should return the string itself for non-empty strings", () => {
    expect(columnFilterValue("hello")).toEqual(["hello"]);
  });

  test("should return nowt", () => {
    expect(columnFilterValue(null, false)).toEqual([""]);
    expect(columnFilterValue(undefined, false)).toEqual([""]);
    expect(columnFilterValue("    ", false)).toEqual([""]);
  });

  test("should return string representation of other data types", () => {
    expect(columnFilterValue(true)).toEqual(["true"]);
    expect(columnFilterValue(false)).toEqual(["false"]);
    expect(columnFilterValue({ value: "One", anotherValue: "Two" })).toEqual(["One", "Two"]);
    expect(columnFilterValue(["❓", "ℹ️", "✅"])).toEqual(["❓", "ℹ️", "✅"]);
    expect(columnFilterValue(new Date("2023-01-01"))).toEqual(["2023-01-01 00:00"]);
    expect(columnFilterValue(() => {})).toEqual(["🛠️🛠️"]);
    expect(columnFilterValue(Symbol("symbol"))).toEqual(["⁉️⁉️"]);
  });

  test("should use custom filter value function if provided", () => {
    const customFn: ISimpleTableColumnFilterValueFn = (dataItem) =>
      Array.isArray(dataItem)
        ? [`custom-${dataItem.map((item: unknown) => `${item}`).join("-")}`]
        : [""];
    expect(columnFilterValue([1, 2, 3], true, customFn)).toEqual(["custom-1-2-3"]);
  });
});
