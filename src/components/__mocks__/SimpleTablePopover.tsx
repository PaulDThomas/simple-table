import { SimpleTablePopoverProps } from "components/SimpleTablePopover";

export const SimpleTablePopover = ({ isVisible, children }: SimpleTablePopoverProps) =>
  isVisible ? <div data-testid="mock-simple-table-popover">{children}</div> : null;
