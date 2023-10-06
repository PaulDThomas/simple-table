import { simpleTableSortFn } from "./simpleTableSortFn";

describe("Test sort function", () => {
  test("Correctly process data", async () => {
    const a = {
      number: 4,
      string: "FIRST",
      date: new Date("2022-01-01"),
    };
    const b = {
      number: 10,
      string: "SECOND",
      date: new Date("2022-01-02"),
    };
    const c = {
      number: null,
      string: undefined,
      date: null,
    };
    expect(simpleTableSortFn(a, b, { name: "number", asc: true })).toEqual(-6);
    expect(simpleTableSortFn(a, c, { name: "number", asc: true })).toEqual(Infinity);

    expect(simpleTableSortFn(a, b, { name: "string", asc: true })).toEqual(-1);
    expect(simpleTableSortFn(a, c, { name: "string", asc: true })).toEqual(-1);

    expect(simpleTableSortFn(a, b, { name: "date", asc: true })).toEqual(-86400000);
    expect(simpleTableSortFn(a, c, { name: "date", asc: true })).toEqual(1);

    expect(simpleTableSortFn(b, a, { name: "number", asc: true })).toEqual(6);
    expect(simpleTableSortFn(c, a, { name: "number", asc: true })).toEqual(-Infinity);

    expect(simpleTableSortFn(b, a, { name: "string", asc: true })).toEqual(1);
    expect(simpleTableSortFn(c, a, { name: "string", asc: true })).toEqual(1);

    expect(simpleTableSortFn(b, a, { name: "date", asc: true })).toEqual(86400000);
    expect(simpleTableSortFn(c, a, { name: "date", asc: true })).toEqual(-1);
  });
});
