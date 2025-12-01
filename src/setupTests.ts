import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

// Configure React 19 testing environment for act() support
// @ts-expect-error - React 19 internal property for testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Suppress React 19 act() warnings that occur during async state updates
// These warnings are expected when testing components with useEffect
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const firstArg = args[0];
    if (typeof firstArg === "string" && firstArg.includes("not configured to support act")) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Workaround for cssstyle 4.x CSS parsing issues in jsdom
// See: https://github.com/jsdom/jsdom/issues/3746
beforeAll(() => {
  // Get the property descriptor for all CSS properties
  const propertyDescriptors = Object.getOwnPropertyDescriptors(CSSStyleDeclaration.prototype);

  Object.keys(propertyDescriptors).forEach((key) => {
    const descriptor = propertyDescriptors[key];
    if (descriptor && descriptor.set) {
      const originalSetter = descriptor.set;
      descriptor.set = function (value: string) {
        try {
          originalSetter.call(this, value);
        } catch {
          // Suppress CSS parsing errors in tests (cssstyle 4.x issues with calc(), rem, etc.)
          // This is safe in test environments as it doesn't affect actual rendering
        }
      };
      Object.defineProperty(CSSStyleDeclaration.prototype, key, descriptor);
    }
  });
});

beforeEach(() => {});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
