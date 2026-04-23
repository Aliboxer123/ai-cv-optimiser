import { validateCVInput } from "@/lib/validators";

describe("CV API validation", () => {
  it("rejects empty CV", () => {
    expect(() => validateCVInput("", "job")).toThrow();
  });

  it("rejects tiny CV", () => {
    expect(() => validateCVInput("short", "job description here")).toThrow();
  });

  it("accepts valid input", () => {
    expect(() =>
      validateCVInput(
        "This is a long enough CV with experience and details...",
        "This is a proper job description with requirements..."
      )
    ).not.toThrow();
  });

  it("rejects oversized CV", () => {
    const bigCV = "x".repeat(7000);
    expect(() => validateCVInput(bigCV, "valid job description")).toThrow();
  });
});