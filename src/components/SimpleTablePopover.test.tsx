import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { SimpleTablePopover } from "./SimpleTablePopover";

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Helper component to pass ref properly
const PopoverWrapper = ({
  anchorElement,
  ...props
}: Omit<React.ComponentProps<typeof SimpleTablePopover>, "anchorElementRef"> & {
  anchorElement: HTMLElement | null;
}) => {
  const ref = React.useRef<HTMLElement | null>(anchorElement);
  return (
    <SimpleTablePopover
      {...props}
      anchorElementRef={ref}
    />
  );
};

describe("SimpleTablePopover", () => {
  let mockAnchorElement: HTMLDivElement;

  beforeEach(() => {
    Object.defineProperty(HTMLDivElement.prototype, "getBoundingClientRect", {
      configurable: true,
      value: function () {
        const thisElement = this as HTMLDivElement;
        const left = thisElement.dataset?.left ? parseInt(thisElement.dataset.left) : 0;
        const right = thisElement.dataset?.right ? parseInt(thisElement.dataset.right) : 0;
        const top = thisElement.dataset?.top ? parseInt(thisElement.dataset.top) : 0;
        const bottom = thisElement.dataset?.bottom ? parseInt(thisElement.dataset.bottom) : 0;
        const height = thisElement.dataset?.height
          ? parseInt(thisElement.dataset.height)
          : thisElement.style.height
            ? parseInt(thisElement.style.height)
            : bottom - top;
        const width = thisElement.dataset?.width
          ? parseInt(thisElement.dataset.width)
          : right - left;
        const x = left;
        const y = top;
        const toJSON = () => ({});
        return {
          top,
          left,
          right,
          bottom,
          height,
          width,
          x,
          y,
          toJSON,
        };
      },
    });

    // Reset the document body
    document.body.innerHTML = "";

    // Create a mock anchor element
    mockAnchorElement = document.createElement("div");
    mockAnchorElement.dataset.left = "600";
    mockAnchorElement.dataset.right = "700";
    mockAnchorElement.dataset.top = "100";
    mockAnchorElement.dataset.bottom = "150";
    mockAnchorElement.className = "mock-anchor";
    document.body.appendChild(mockAnchorElement);

    // Mock window dimensions
    global.innerWidth = 1024;
    global.innerHeight = 768;
  });

  test("No anchor element still renders", () => {
    render(
      <PopoverWrapper
        isVisible={true}
        anchorElement={null}
        onClose={jest.fn()}
      >
        <div data-testid="popover-content">Test content</div>
      </PopoverWrapper>,
    );

    expect(screen.queryByTestId("popover-content")).toBeInTheDocument();
    fireEvent.scroll(window);
    expect(screen.queryByTestId("popover-content")).toBeInTheDocument();
  });

  test("renders correctly with default left alignment", async () => {
    const mockClose = jest.fn();
    // Mock anchor element that's close to the left edge
    mockAnchorElement.dataset.left = "200";
    mockAnchorElement.dataset.right = "300";
    mockAnchorElement.dataset.top = "100";
    mockAnchorElement.dataset.bottom = "150";
    render(
      <PopoverWrapper
        isVisible={true}
        anchorElement={mockAnchorElement}
        onClose={mockClose}
        data-height="250px"
        data-width="250px"
      >
        <div data-testid="popover-content">Test content</div>
      </PopoverWrapper>,
    );

    const popoverContent = screen.getByTestId("popover-content");
    expect(popoverContent).toBeInTheDocument();
    expect(popoverContent.parentElement).toHaveStyle({
      left: "200px",
      top: "150px",
      right: "auto",
      bottom: "auto",
    });

    // Flips to right alignment if there's not enough space
    global.innerWidth = 400;
    await act(async () => window.dispatchEvent(new Event("resize")));
    expect(popoverContent.parentElement).toHaveStyle({
      left: "auto",
      right: "100px",
      top: "150px",
      bottom: "auto",
    });

    // Make it too small to fit
    mockAnchorElement.dataset.left = "10";
    mockAnchorElement.dataset.right = "20";
    global.innerWidth = 30;
    await act(async () => window.dispatchEvent(new Event("resize")));
    expect(mockClose).toHaveBeenCalled();
  });

  test("renders on the right when not enough space on the left", async () => {
    const mockClose = jest.fn();
    // Mock anchor element that's past the edge
    mockAnchorElement.dataset.left = "900";
    mockAnchorElement.dataset.right = "1000";
    mockAnchorElement.dataset.top = "100";
    mockAnchorElement.dataset.bottom = "150";

    await act(async () =>
      render(
        <PopoverWrapper
          isVisible={true}
          anchorElement={mockAnchorElement}
          onClose={mockClose}
          data-height="400px"
          data-width="400px"
        >
          <div data-testid="popover-content">Test content</div>
        </PopoverWrapper>,
      ),
    );
    const popover = screen.getByTestId("popover-content").parentElement;
    expect(popover).toBeInTheDocument();
    // Check if the popover is aligned to the right
    expect(popover).toHaveStyle({ right: "24px", left: "auto" });

    // Flips to left alignment if there's enough space
    global.innerWidth = 2000;
    await act(async () => window.dispatchEvent(new Event("resize")));
    expect(popover).toHaveStyle({ left: "900px", right: "auto" });

    // Make it too small to fit
    mockAnchorElement.dataset.left = "10";
    mockAnchorElement.dataset.right = "20";
    global.innerWidth = 30;
    await act(async () => window.dispatchEvent(new Event("scroll")));
    expect(mockClose).toHaveBeenCalled();
  });

  test("does not render when isVisible is false", () => {
    render(
      <PopoverWrapper
        isVisible={false}
        anchorElement={mockAnchorElement}
        onClose={jest.fn()}
      >
        <div data-testid="popover-content">Test content</div>
      </PopoverWrapper>,
    );

    expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();
  });

  test("closes when anchor element is not visible", () => {
    const mockClose = jest.fn();
    // Mock anchor element that's out of view
    mockAnchorElement.dataset.top = "-100";
    mockAnchorElement.dataset.bottom = "-50";
    mockAnchorElement.dataset.left = "-100";
    mockAnchorElement.dataset.right = "-50";

    render(
      <PopoverWrapper
        isVisible={true}
        anchorElement={mockAnchorElement}
        onClose={mockClose}
      >
        <div data-testid="popover-content">Test content</div>
      </PopoverWrapper>,
    );

    expect(mockClose).toHaveBeenCalled();
  });

  test("closes when escape key is pressed", () => {
    const mockClose = jest.fn();
    render(
      <PopoverWrapper
        isVisible={true}
        anchorElement={mockAnchorElement}
        onClose={mockClose}
      >
        <div data-testid="popover-content">Test content</div>
      </PopoverWrapper>,
    );

    // Simulate pressing Escape
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockClose).toHaveBeenCalled();
  });

  test("Closes when there is not enough height", async () => {
    const mockClose = jest.fn();
    await act(async () =>
      render(
        <PopoverWrapper
          isVisible={true}
          anchorElement={mockAnchorElement}
          onClose={mockClose}
          data-height="250px"
          data-width="250px"
        >
          <div data-testid="popover-content">Test content</div>
        </PopoverWrapper>,
      ),
    );
    // Shrink the window height to cause the popover to shrink too
    global.innerHeight = 300;
    await act(async () => window.dispatchEvent(new Event("resize")));
    const popover = screen.getByTestId("popover-content").parentElement;
    expect(popover).toBeInTheDocument();
    expect(popover).toHaveStyle({ height: "126px" });

    // Mock a height that is too small
    global.innerHeight = 200;
    await act(async () => window.dispatchEvent(new Event("scroll")));
    expect(mockClose).toHaveBeenCalled();
  });
});
