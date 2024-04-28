import "@testing-library/jest-dom";
import { localStorageMock } from "../__dummy__/localStorageMock";

// Move the reload function
beforeAll(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { reload: jest.fn() },
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  document.documentElement.scrollTo = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  process.env.REACT_APP_API_URL = "/";
});

beforeEach(() => {
  jest.clearAllMocks();
  let counter = 1000;
  Object.defineProperty(window, "crypto", {
    writable: true,
    value: {
      randomUUID: () => {
        counter++;
        return `00000000-aaaa-1111-cccc-00000000${counter}`;
      },
    },
  });
  Object.defineProperty(window, "localStorage", { value: new localStorageMock() });
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(() => {});
