import { columnFilterValue } from "./columnFilterValue";

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
