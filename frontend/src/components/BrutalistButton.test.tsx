import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BrutalistButton from "./BrutalistButton";
import { MemoryRouter } from "react-router-dom";
import { Mail } from "lucide-react";

describe("BrutalistButton", () => {
  it("should render children correctly", () => {
    render(<BrutalistButton>Click Me</BrutalistButton>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<BrutalistButton onClick={handleClick}>Click Me</BrutalistButton>);
    
    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should render as a link when 'to' is provided", () => {
    render(
      <MemoryRouter>
        <BrutalistButton to="/dashboard">Go Home</BrutalistButton>
      </MemoryRouter>
    );
    
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("should show loading spinner and be disabled when isLoading is true", () => {
    render(<BrutalistButton isLoading>Submit</BrutalistButton>);
    
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    // Lucide-react icons are rendered as SVGs
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should render an icon when provided", () => {
    render(<BrutalistButton icon={Mail}>Mail</BrutalistButton>);
    // Icon components render an SVG with a data-lucide attribute (usually) or just a className
    // We can check for the lucide class or just ensure it's in the DOM
    expect(document.querySelector(".lucide-mail")).toBeInTheDocument();
  });

  it("should apply variant styles", () => {
    const { container } = render(<BrutalistButton variant="danger">Delete</BrutalistButton>);
    expect(container.firstChild).toHaveClass("bg-rose-500/10");
  });
});
