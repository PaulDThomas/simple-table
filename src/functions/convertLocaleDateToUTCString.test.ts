import { convertLocaleDateToUTCString } from "./convertLocaleDateToUTCString";

describe("convert tests", () => {
  test("invalid convertLocaleDateToUTCString", () => {
    expect(convertLocaleDateToUTCString("invalid")).toBe("Invalid date");
  });

  test("convertLocaleDateToUTCString", () => {
    expect(convertLocaleDateToUTCString("2022-01-01T00:00:00+05:30")).toBe(
      "2021-12-31T18:30:00.000Z",
    );
  });
});
