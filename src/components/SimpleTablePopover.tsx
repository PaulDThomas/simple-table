import React, { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./SimpleTableHeaderContents.module.css";

export interface SimpleTablePopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isVisible: boolean;
  anchorElementRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

export const SimpleTablePopover = ({
  children,
  isVisible,
  anchorElementRef,
  onClose,
  ...rest
}: SimpleTablePopoverProps): React.ReactElement | null => {
  const [position, setPosition] = useState<{
    top: number | undefined;
    left: number | undefined;
    right: number | undefined;
  }>({
    top: undefined,
    left: undefined,
    right: undefined,
  });
  const [alignment, setAlignment] = useState<"left" | "right">("left");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anchorElement = anchorElementRef.current;
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
        anchorRect.right > windowWidth
      ) {
        onClose();
        return;
      }

      // Default position below the anchor
      const top = anchorRect.bottom;
      const left = anchorRect.left;
      const right = anchorRect.right;

      // Check horizontal boundaries
      if (alignment === "right") {
        // Close if there is no room
        if (right - popoverRect.width <= 0 && left + popoverRect.width >= windowWidth) {
          onClose();
          return;
        }
        // If right alignment goes out of bounds, switch to left alignment
        if (left + popoverRect.width < windowWidth - 8) {
          setAlignment("left");
        }
      } else {
        // Close if there is no room
        if (left + popoverRect.width >= windowWidth - 8 && right - popoverRect.width <= 0) {
          onClose();
          return;
        }
        // If left alignment goes out of bounds, switch to right alignment
        if (left + popoverRect.width >= windowWidth - 8 && right - popoverRect.width > 0) {
          setAlignment("right");
        }
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

      const newPosition = {
        top,
        left: alignment === "left" ? left : undefined,
        right: alignment === "right" ? windowWidth - right : undefined,
      };
      setPosition(newPosition);
    };

    // Initial position update
    updatePosition();

    // Set up observers and event listeners
    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    // Handle escape key press
    const handleKeyDown = (event: KeyboardEvent) => {
      // istanbul ignore else
      if (event.key === "Escape") {
        window.removeEventListener("keydown", handleKeyDown);
        onClose();
      }
    };

    const resizeObserver = new ResizeObserver(updatePosition);

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
  }, [alignment, anchorElementRef, isVisible, onClose]);

  if (!isVisible) return null;

  return createPortal(
    <div
      {...rest}
      ref={popoverRef}
      className={styles.filterHolder}
      style={{
        visibility: position.top !== undefined ? "visible" : "hidden",
        top: position.top !== undefined ? `${position.top}px` : "auto",
        bottom: "auto",
        left: position.left !== undefined ? `${position.left}px` : "auto",
        right: position.right !== undefined ? `${position.right}px` : "auto",
        resize: alignment === "right" ? "none" : undefined,
      }}
    >
      {children}
    </div>,
    document.body,
  );
};
