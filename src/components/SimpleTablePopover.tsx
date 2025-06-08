import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./SimpleTableHeaderContents.module.css";

interface SimpleTablePopoverProps {
  children: ReactNode;
  isVisible: boolean;
  anchorElement: HTMLElement | null;
  onClose: () => void;
}

export const SimpleTablePopover = ({
  children,
  isVisible,
  anchorElement,
  onClose,
}: SimpleTablePopoverProps): JSX.Element | null => {
  const [position, setPosition] = useState<{ top: number | undefined; left: number | undefined }>({
    top: undefined,
    left: undefined,
  });
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !anchorElement) return;

    const updatePosition = () => {
      if (!anchorElement || !popoverRef.current) return;

      const anchorRect = anchorElement.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Close if the anchor is not visible
      if (
        anchorRect.bottom < 8 ||
        anchorRect.right < 8 ||
        anchorRect.top > windowHeight ||
        anchorRect.left > windowWidth
      ) {
        onClose();
        return;
      }

      // Default position below the anchor
      const top = anchorRect.bottom;
      const left = anchorRect.left;

      // Check horizontal boundaries
      if (left + popoverRect.width > windowWidth) {
        const newWidth = windowWidth - left - 24;
        if (newWidth < 50) {
          onClose();
          return;
        }
        popoverRef.current.style.width = `${newWidth}px`;
      }

      // Check vertical boundaries
      if (top + popoverRect.height > windowHeight) {
        const newHeight = windowHeight - top - 24;
        if (newHeight < 100) {
          onClose();
          return;
        }
        popoverRef.current.style.height = `${newHeight}px`;
      }

      setPosition({ top, left });
    };

    // Initial position update
    updatePosition();

    // Set up observers and event listeners
    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    // Handle escape key press
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.removeEventListener("keydown", handleKeyDown);
        onClose();
      }
    };

    // Create a unified ResizeObserver to handle all resize scenarios
    const resizeObserver = new ResizeObserver((entries) => {
      // Check if the popover itself is resizing
      const popoverEntry = entries.find((entry) => entry.target === popoverRef.current);

      if (popoverEntry && popoverRef.current) {
        const popoverRect = popoverRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Check if popover extends beyond window boundaries
        if (popoverRect.right > windowWidth) {
          // Adjust width to fit window
          const newWidth = windowWidth - popoverRect.left - 10;
          if (newWidth < 50) onClose();
          popoverRef.current.style.width = `${newWidth}px`;
        }

        if (popoverRect.bottom > windowHeight) {
          // Adjust height to fit window
          const newHeight = windowHeight - popoverRect.top - 10;
          if (newHeight < 50) onClose();
          popoverRef.current.style.height = `${newHeight}px`;
        }
      }

      // Always update position on any resize event
      updatePosition();
    });

    // Observe the popover and anchor element for resizing
    if (popoverRef.current) {
      resizeObserver.observe(popoverRef.current);

      // Observe the parent elements up to the body to detect layout changes
      let el: HTMLElement | null = anchorElement;
      while (el && el !== document.body) {
        resizeObserver.observe(el);
        el = el.parentElement;
      }
    }

    // Listen for scroll and resize events
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    // Clean up all event listeners and observers
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, anchorElement, onClose]);

  if (!isVisible) return null;

  return createPortal(
    <div
      ref={popoverRef}
      className={styles.filterHolder}
      style={{
        visibility:
          position.top !== undefined && position.left !== undefined ? "visible" : "hidden",
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {children}
    </div>,
    document.body,
  );
};
