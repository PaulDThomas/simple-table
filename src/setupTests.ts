import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

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

afterAll(() => {});
