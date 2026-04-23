import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

describe("CV Optimiser UI", () => {
  it("renders main title", () => {
    render(<Page />);
    expect(screen.getByText("AI CV Optimiser")).toBeInTheDocument();
  });

  it("shows generate button", () => {
    render(<Page />);
    expect(screen.getByText("Generate CV")).toBeInTheDocument();
  });
});