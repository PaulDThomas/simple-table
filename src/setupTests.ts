import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

beforeAll(() => {});

beforeEach(() => {});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

afterAll(() => {});
